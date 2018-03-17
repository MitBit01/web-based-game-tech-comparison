import schedule, time, threading, random
class EngineObject(object):
    pass
Game = EngineObject()
Game.width = 700
Game.height = 700
Game.pt = time.time()
Game.dt = 0
Entities = []
class Entity:
    def __init__(self, x, y, r):
        global Entities
        self.x = x
        self.y = y
        self.r = r
        self.destroy = False
        self.tag = ''
        self.id = ''
        Entities.append(self)
    def update(self, dt):
        global Entities, Game
        if self.destroy:
            Entities.remove(self)
        else:
            if self.tag == 'player':
                self.x += self.vx
                self.y += self.vy
                self.vx *= 0.99
                self.vy *= 0.99
                if self.cooldown > 0: self.cooldown -= 1
            elif self.tag == 'shot':
                self.x += self.vx * dt
                self.y += self.vy * dt
                if self.life > 0: self.life -= 1
                else: self.destroy = True
            if self.x < 0: self.x = Game.width
            if self.y < 0: self.y = Game.height
            if self.x > Game.width: self.x = 0
            if self.y > Game.height: self.y = 0
    def collided(self, a, b):
        distSq = (a.x - b.x) * (a.x - b.x) + (a.y- b.y) * (a.y- b.y)
        radSq = (a.r + b.r) * (a.r + b.r)
        if distSq <= radSq: return True
        else: return False
    def collide(self, other):
        if self.tag == 'player' and other.tag == 'shot' and self.collided(self, other):
            self.destroy = True
            other.destroy = True
def updates(dt):
    global Entities
    for e in Entities:
        e.update(dt)
def collisions():
    global Entities
    for a in Entities:
        for b in Entities:
            if a is not b:
                a.collide(b)
                b.collide(a)
def run():
    global Game
    now = time.time()
    Game.dt = (now - Game.pt)
    updates(Game.dt)
    collisions()
    Game.pt = now
def Random(max = None):
    if max: return random.randint(0, max)
    else: return random.random()

def run_threaded(fn):
    threading.Thread(target=fn).start()
def setup():
    schedule.every(0.1).seconds.do(run_threaded, run)
    while True:
        schedule.run_pending()
        time.sleep(0.25)
threading.Thread(target=setup).start()

random.seed()