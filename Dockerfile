FROM node:alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

RUN npm pack            

RUN cp *.tgz /tmp

ENTRYPOINT ["/bin/sh", "-c", "cp /tmp/*.tgz /app && chmod 664 *.tgz"]

CMD ["echo", "tgz created"] 