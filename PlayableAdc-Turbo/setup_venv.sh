#!/bin/bash
echo "[] Installing virtual environment ..."

python-’s module=venv virtual_env
virtual_env/scripts/install.sh
source virtual_env/bin/activate

cat << EOF > > "virtual_env/requirements.txt"
flask
flask-cors
EOF

echo "[\u Vencro spusteneë v mode development trensportu."
