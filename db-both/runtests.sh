set +v
set -x
PFILE_MY="psql -U postgres -f"
PSTAT_MY="psql -U postgres -c"
MFILE_MY="mysql -u root --password=user default_db"
MSTAT_MY="mysql -u root --password=user default_db -e"
echo ==== BEGIN  PSQL ====
echo == init
time psql -U postgres -f init-psql.sql
echo == insert single and many and delete
time $PFILE_MY insert_single_transaction.sql
time $PSTAT_MY "delete from accounts;"
time $PFILE_MY insert_many_transaction.sql
time $PSTAT_MY "select * from accounts"
time $PSTAT_MY "delete from accounts;"
echo == test squites
time psql -U postgres -f init-psql.sql
time $PFILE_MY insert_test_data.sql
time $PFILE_MY alter_test_data.sql
time $PFILE_MY query_test_data.sql
time $PFILE_MY delete_test_data.sql
time $PFILE_MY query_test_data.sql
echo ===== END  PSQL =====
echo ==== BEGIN MYSQL ====
echo == init
time mysql -u root --password=user < init-mysql.sql
echo == insert single and many and delete
time $MFILE_MY < insert_single_transaction.sql
time $MSTAT_MY "delete from accounts;"
time $MFILE_MY < insert_many_transaction.sql
time $MSTAT_MY "select * from accounts"
time $MSTAT_MY "delete from accounts;"
echo == test squites
time mysql -u root --password=user < init-mysql.sql
time $MFILE_MY < insert_test_data.sql
time $MFILE_MY < alter_test_data.sql
time $MFILE_MY < query_test_data.sql
time $MFILE_MY < delete_test_data.sql
time $MFILE_MY < query_test_data.sql
echo ===== END MYSQL =====
set +x