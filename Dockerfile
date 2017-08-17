# docker build -t mondrian-rest-ui .
# docker run -e REACT_APP_API_URL=http://api_host:3000/ --link MY_APP_CONTAINER:api_host -p 3030:3000 mondrian-rest-ui

FROM kkarczmarczyk/node-yarn

WORKDIR /app/src

COPY package.json .
# If we ever move to yarn files
# COPY yarn.* .
RUN yarn

COPY . .

EXPOSE 3000

CMD yarn start
