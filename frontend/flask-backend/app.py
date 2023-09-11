from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
socketio = SocketIO(app, ping_interval=25, ping_timeout=60)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on("join")
def join():
    join_room('user_'+request.sid)
    emit('join', "room joined : " + request.sid)


@socketio.on('message')
def handle_client_message(data):
    room_name = "user_" + request.sid

    # code to generate responce
    respon = "Your message is " + data['msg']
    # print(data)

    emit('message', {'msg': respon}, room=room_name)

@socketio.on('disconnect')
def handle_disconnect():
    print("user leave room "+ request.sid)
    leave_room('user_'+request.sid)


if __name__ == '__main__':
    socketio.run(app, debug=True)
