from flask import Flask  
from flask import render_template
from flask import request
import requests
import uuid
from flask import jsonify, send_file
import os
import getPutDB 
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, emit, join_room, leave_room


app = Flask(__name__)
app.config["UPLOAD_FOLDER"] ="/Users/kartikbaderiya/Documents/PROJECT_CHATBOT/user_content/" #directory location to store user documents
app.config["CORS_HEADERS"] = "Content-Type"
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
socketio = SocketIO(app, ping_interval=25, ping_timeout=60)




## Create user API
@app.route("/api/user/create",methods=["POST"])
@cross_origin()
def create_user():
    uniqueid = str(uuid.uuid4()) 
    fields = request.get_json()   
    data = {
        "uuid":uniqueid,
        "name":fields["name"],
        "role":fields["role"],
        "upload":False,
        }
    
    res = getPutDB.createuser(uniqueid=uniqueid,name=fields["name"],role=fields["role"])
    if res:
        data = {"uuid":uniqueid}
        
    return jsonify(data)




## Set OpenAI API 
@app.route("/api/set-open-key",methods=["POST"])
def set_key():
    print("heloo")
    fields = request.get_json()
    print("opkey")
    print(fields["openkey"])
    res = getPutDB.setopenai(uniqueid=fields["uuid"],openkey=fields["openkey"])
    
    if res:
        data = {"success":True}
        return jsonify(data)



## API for uploading Document
@app.route("/api/upload",methods=["POST"])
def file_upload():
    print("----")
    print(request.form)
    print(request.files)
    file = request.files["file"]
    print(file)
    if file.filename == "":
        return "No file selected"

    uniqueid = request.form["uuid"]
    fname = app.config["UPLOAD_FOLDER"]+f"{uniqueid}/"+uniqueid+"_document_"+file.filename

    # st_dir = os.path.join(app.config["UPLOAD_FOLDER"],uniqueid)
    # if not os.path.exists(st_dir):
    #     os.makedirs(st_dir,exist_ok=True)
        
    # # file.save(os.path.join(app.config["UPLOAD_FOLDER"],fname))
    
    # fname = os.path.join(st_dir,file.filename)
    file.save(fname)
    getPutDB.setfpath(uniqueid=uniqueid,filepath=fname)

    print("&&&&&&&&&&****&&&&&&&&&")
    print(fname)

    res = getPutDB.setfpath(uniqueid=uniqueid,filepath=fname)

    if res:    
        data = {"success":True}
        return jsonify(data)




# API to send query
@app.route("/api/send-message",methods=["POST"])
def send_query():
    fields = request.get_json()
    response = requests.post("http://127.0.0.1:9000/ans_query",json=fields)
    res = response.json()
    return jsonify(res)


# Socket io events

# Connect to socket
@socketio.on('connect')
def handle_connect():
    print('Client connected')


# Join room
@socketio.on("join")
def join():
    join_room('user_'+request.sid)
    emit('join', "room joined : " + request.sid)


# Send Message
@socketio.on('message')
def handle_client_message(data):
    room_name = "user_" + request.sid

    # code to generate responce
    response = requests.post("http://127.0.0.1:9000/ans_query",json=data)
    res = response.json()

    emit('message', res, room=room_name)


# Disconnect socket
@socketio.on('disconnect')
def handle_disconnect():
    print("user leave room "+ request.sid)
    leave_room('user_'+request.sid)



if __name__ == "__main__":
    # app.run(port=4000,debug=True)
    socketio.run(app, debug=True)