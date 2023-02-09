# Make a Redis container in docker using the cli
1. Start a Redis container:
```
docker run --name my-redis -d redis
```
2. Connect to the Redis container and configure a password
```
docker exec -it my-redis redis-cli

127.0.0.1:6379> config set requirepass "your-password"
OK
127.0.0.1:6379> exit
```
3. Restart the Redis container for the changes to take effect:
```
docker restart my-redis
```
4. Connect to the Redis container using the password:
```
docker exec -it my-redis redis-cli -a "your-password"
```
# Make a redis container in docker using a Dockerfile
```
FROM redis:latest

RUN echo "requirepass your-password" >> /etc/redis/redis.conf

EXPOSE 6379
CMD [ "redis-server", "/etc/redis/redis.conf" ]
```

