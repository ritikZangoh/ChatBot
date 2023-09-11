from flask import Flask  
from flask import request
import requests
import uuid
from flask import jsonify
import os
import getPutDB 
from flask_cors import CORS, cross_origin
import us_lamma
import create_user_index


app = Flask(__name__)
app.config["UPLOAD_FOLDER"] ="/Users/kartikbaderiya/Documents/PROJECT_CHATBOT/user_content/" #directory location to store user documents
app.config["CORS_HEADERS"] = "Content-Type"
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})



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
    file = request.files["file"]
    print(file)
    if file.filename == "":
        return "No file selected"

    uniqueid = request.form["uuid"]
    # st_dir = os.path.join(app.config["UPLOAD_FOLDER"],(uniqueid+"/"))
    # if not os.path.exists(st_dir):
    #     os.makedirs(st_dir,exist_ok=True)
        
    # fname = os.path.join(st_dir,file.filename)
    # file.save(fname)

    # res = getPutDB.setfpath(uniqueid=uniqueid,filepath=str(st_dir))

    content = file.read()    
    fname = file.filename

    res = getPutDB.set_file(uniqueid=uniqueid,filedata=content,filename=fname)

    if res:
        opkey = getPutDB.openkey(uniqueid=uniqueid)
        res = create_user_index.create_pinecode_ind(unid=uniqueid,filedata=str(content),opkey=opkey)

    if res:    
        data = {"success":True}
        return jsonify(data)


# API to send query
@app.route("/api/send-message",methods=["POST"])
def send_query():
    fields = request.get_json()
    opkey = getPutDB.openkey(uniqueid=fields["uuid"])
    res = us_lamma.query_ans(unid=fields["uuid"],query=fields["msg"],opkey=opkey)
    res = {
        "msg":str(res)
    }
    return jsonify(res)




if __name__ == "__main__":
    app.run(port=4000,debug=True)