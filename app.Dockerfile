FROM node:24

COPY . .

RUN npm i
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/bootstrap.js"]