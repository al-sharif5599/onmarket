import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

try:
    conn = psycopg2.connect(dbname='postgres', user='postgres', password='Al sharif', host='localhost')
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()
    cur.execute('DROP DATABASE IF EXISTS online_shop_db')
    cur.execute('CREATE DATABASE online_shop_db')
    cur.close()
    conn.close()
    print('Database recreated successfully')
except Exception as e:
    print(f'Error: {e}')
