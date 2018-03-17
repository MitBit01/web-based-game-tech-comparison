from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json, math
from . import gameEngine as ge
class GameConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']
        self.room_group_name = 'game'
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()
    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )
    def receive(self, text_data):
        data = json.loads(text_data)
        if data['event'] == 'chat message':
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'result',
                    'event': 'chat message',
                    'message': data['message']
                }
            )
        elif data['event'] == 'new player':
            player = ge.Entity(ge.Random(700), ge.Random(700), 15)
            player.angle = 0
            player.vx = 0;
            player.vy = 0;
            player.cooldown = 0;
            player.tag = 'player'
            player.id = ge.Random()
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'result',
                    'event': 'add',
                    'id': player.id
                }
            )
        elif data['event'] == 'sync':
            player = next((e for e in ge.Entities if e.id == data['id']), None)
            if player:
                player.angle = math.atan2(data['my'] - player.y, data['mx'] - player.x)
                if 'ml' in data.keys() and data['ml']:
                    player.vx += math.cos(player.angle) * 3 * ge.Game.dt
                    player.vy += math.sin(player.angle) * 3 * ge.Game.dt
                if player.vx > 300: player.vx = 300
                if player.vy > 300: player.vy = 300
                if player.vx < -300: player.vx = -300
                if player.vy < -300: player.vy = -300
                if 'mr' in data.keys() and data['mr'] and player.cooldown == 0:
                    player.cooldown = 20
                    shot = ge.Entity(player.x + math.cos(player.angle) * player.r * 2,
                        player.y + math.sin(player.angle) * player.r * 2,
                        10)
                    shot.tag = 'shot'
                    shot.vx = math.cos(player.angle) * 200 + player.vx * 3
                    shot.vy = math.sin(player.angle) * 200 + player.vy * 3
                    shot.life = 240
            sel = []
            for e in ge.Entities:
                se = {}
                for k in e.__dict__.keys():
                    se[k] = e.__dict__[k]
                sel.append(se)
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'result',
                    'event': 'sync',
                    'Entities': sel
                }
            )
    def result(self, data):
        self.send(text_data=json.dumps(data))