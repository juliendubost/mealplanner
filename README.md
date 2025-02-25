Meal planner app including a python backend and a react frontend

# Frontend

## project init

```shell
yarn set version stable
yarn create react-app frontend --template typescript
```

## Deploy using nginx

Setup backend url in line `axios.get('http://localhost:8000/meal'`
Then `yarn build` and deploy build directory to server. Ensure files permissions are correct

# Backend

## runserver 

```shell
uvicorn main:app
```

## Deploy using uvicorn + nginx

Run `uvicorn --uds /path/to/file.sock main:app` inside a screen or using a process manager (supervisord f.e)

# Templates

## Nginx file

```text
upstream uvicorn {
      server unix:/var/run/uvicorn/uvicorn.sock;
}

# backend
server {
	listen 80;
	listen [::]:80;
	root /var/www/mealplanner;

	# Add index.php to the list if you are using PHP
	index index.html index.htm index.nginx-debian.html site.php index.php;

	server_name be.fqdn;

    location / {
      proxy_set_header Host $http_host;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header Upgrade $http_upgrade;
      proxy_redirect off;
      proxy_buffering off;
      proxy_pass http://uvicorn;
    }
}

# frontend
server {
	listen 80;
	listen [::]:80;

 	root /var/www/mealplanner/frontend/build;

	# Add index.php to the list if you are using PHP
	index index.html index.htm index.nginx-debian.html site.php index.php;

	server_name fe.fqdn;
}

```


