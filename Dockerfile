# docker build -t mondrian-rest-ui .
# docker run -e REACT_APP_API_URL=http://MONDRIAN_REST_HOST:3000/ -p 3030:3000 mondrian-rest-ui
# Where MONDRIAN_REST_HOST is the host relative to the browser client.

FROM node:latest

WORKDIR /app/src
COPY    . .
RUN     npm install

CMD ["npm", "run", "build"]
