#!/bin/bash

cd GPT-Doc-Chatbot
gunicorn -k eventlet -w 1 runServer:app &

sleep 6

cd ..
cd frontend

npm run dev
