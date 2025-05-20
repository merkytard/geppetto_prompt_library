# launcher.py
from flask import Flask, request, send_file, jsonify, send_from_directory
import os, zipfile, shutil, webbrowser

PORT = 8080
SESSION = session_casino
GAME = 777_Casino_Slot_Machines_V1_version1
ZIP = f{GAME}.zip
UI = editor_ui.html
ASSETS = [symbols, video_graphics]

app = Flask(__name__, static_folder=None)

@app.after_request
def no_cache(r)
    r.headers[Cache-Control] = no-cache, no-store, must-revalidate
    r.headers[Pragma] = no-cache
    r.headers[Expires] = 0
    return r

# — API — 

@app.route(upload_game, methods=[POST])
def upload_game()
    z = request.files.get(file)
    if not z or not z.filename.endswith(.zip)
        return jsonify(status=error, message=Invalid ZIP), 400
    # reset session
    if os.path.exists(SESSION)
        shutil.rmtree(SESSION)
    os.makedirs(SESSION, exist_ok=True)
    # save & unpack
    zp = os.path.join(SESSION, ZIP)
    z.save(zp)
    with zipfile.ZipFile(zp, r) as zf
        zf.extractall(SESSION)
    # ensure asset dirs
    for t in ASSETS
        os.makedirs(os.path.join(SESSION, GAME, Assets, t), exist_ok=True)
    create_wrapper()
    return jsonify(status=ok, message=Game ZIP loaded)

@app.route(list_assets)
def list_assets()
    t = request.args.get(type)
    if t not in ASSETS
        return jsonify(files=[])
    p = os.path.join(SESSION, GAME, Assets, t)
    return jsonify(files=[f for f in os.listdir(p)
                          if f.lower().endswith((.png,.jpg,jpeg))])

@app.route(download_asset)
def download_asset()
    name = request.args.get(filename)
    t = request.args.get(type)
    path = os.path.join(SESSION, GAME, Assets, t, name)
    if not os.path.isfile(path)
        return jsonify(status=error, message=Not found), 404
    return send_file(path, as_attachment=True)

@app.route(upload_asset, methods=[POST])
def upload_asset()
    f = request.files[file]
    name = request.form[filename]
    t = request.form[type]
    target = os.path.join(SESSION, GAME, Assets, t, name)
    f.save(target)
    return jsonify(status=ok, message=f{name} updated)

@app.route(export_zip)
def export_zip()
    base = os.path.join(SESSION, exported)
    shutil.make_archive(base, zip, SESSION)
    return send_file(base + .zip, as_attachment=True)

# — hra + statika — 

@app.route(game)
def serve_game()
    path = os.path.join(SESSION, GAME, f{GAME}.html)
    html = open(path, encoding=utf-8).read()
    inj = 
script
window.addEventListener('message',e={
  const c = e.data.command;
  if(c==='start'&&window.game&&game.loop) game.loop.wake();
  if(c==='pause'&&window.game&&game.loop) game.loop.sleep();
  if(c==='reset') location.reload();
});
script

    return html.replace(body, inj+body)

@app.route(, defaults={fn UI})
@app.route(pathfn)
def static_proxy(fn)
    # 1) session_casinofn
    p1 = os.path.join(SESSION, fn)
    if os.path.isfile(p1)
        return send_from_directory(SESSION, fn)
    # 2) session_casinoGAMEfn
    p2 = os.path.join(SESSION, GAME, fn)
    if os.path.isfile(p2)
        return send_from_directory(os.path.join(SESSION, GAME), fn)
    # not found
    return 404, 404

def create_wrapper()
    html = f!DOCTYPE html
html lang=enheadmeta charset=UTF-8titleCasino Editortitle
style
 body{{margin0;background#111;color#eee}}
 #menu{{padding10px;background#222;positionfixed;width100%;z-index10}}
 #menu button,#menu select{{margin-right6px}}
 iframe{{width100%;heightcalc(100vh-60px);bordernone}}
styleheadbody
 div id=menu
   button onclick=zipIn.click()Load ZIPbutton
   button onclick=reload()Reloadbutton
   button onclick=cmd('start')??button
   button onclick=cmd('pause')??button
   button onclick=cmd('reset')?button
   button onclick=save()Savebutton
   Type
   select id=atype onchange=refresh()
     option value=symbolssymbolsoption
     option value=video_graphicsvideooption
   select
   select id=alist onchange=selAsset(this.value)
     option— none —option
   select
   button id=dl disabled onclick=dl()??button
   button id=up disabled onclick=upIn.click()??button
 div
 input type=file id=zipIn style=displaynone accept=.zip onchange=loadZIP(event)
 input type=file id=upIn  style=displaynone accept=image onchange=upload(event)
 iframe id=frame allow=autoplay src=gameiframe
script
let sel='',type='symbols';
function loadZIP(e){let f=e.target.files[0];if(!f)return;let fd=new FormData();fd.append('file',f);
 fetch('upload_game',{method'POST',bodyfd}).then(r=r.json()).then(_=location.reload());}
function reload(){ frame.src='gamet='+Date.now();}
function cmd(c){frame.contentWindow.postMessage({commandc},'')}
function save(){window.open('export_zip','_blank')}
function refresh(){
  type=document.getElementById('atype').value;sel='';
  fetch(`list_assetstype=${type}`).then(r=r.json()).then(j={
    let s=document.getElementById('alist');
    s.innerHTML='option— none —option';
    j.files.forEach(f=s.add(new Option(f,f)));
    dl.disabled=true;up.disabled=true;
  });
}
function selAsset(v){sel=v;dl.disabled=!v;up.disabled=!v}
function dl(){window.open(`download_assettype=${type}&filename=${sel}`,'_blank')}
function upload(e){
  let f=e.target.files[0];if(!f!sel)return;
  let fd=new FormData();fd.append('file',f);
  fd.append('filename',sel);fd.append('type',type);
  fetch('upload_asset',{method'POST',bodyfd}).then(_=reload());
}
window.onload=refresh;
script
bodyhtml
    os.makedirs(SESSION, exist_ok=True)
    with open(os.path.join(SESSION, UI),w,encoding=utf-8) as f
        f.write(html)

if __name__==__main__
    # init session
    if os.path.exists(SESSION) shutil.rmtree(SESSION)
    os.makedirs(SESSION, exist_ok=True)
    # unpack default ZIP if exist
    if os.path.isfile(ZIP)
        with zipfile.ZipFile(ZIP,r) as z z.extractall(SESSION)
    # ensure asset dirs
    for t in ASSETS
        os.makedirs(os.path.join(SESSION, GAME, Assets, t), exist_ok=True)
    # build UI + launch
    create_wrapper()
    webbrowser.open(fhttplocalhost{PORT})
    print(f?? Running at httplocalhost{PORT})
    app.run(port=PORT, debug=False)
