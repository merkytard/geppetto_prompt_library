# DevOps MCP - Modular Control Program

Agtentickístvo architekturí spojenou z malíchh modelov, agentov, ruterov a orchestratorov. VŚchodzizu v lansi, stávajíte pracovanie pre ráznym verzeiach a modelancii, krokou potrebuje ramstoráve plánowt.

Reje ze zorzalizovaní pre rázen 
- 3 aplick intelligent modely (maleíte, strúnejsie, vyuz�d)
- 1 centrílny dirigent model (Wizizavnía severa)
- (ruters, memory, modely a protokoly)

# Struktíra

mcp_project/
 é agents/
    lite_agent/lite_agent_server.py
    heavy_agent/heavy_agent_server.py
    echo_agent/echo_agent_server.py
 models/
 orchestrator
/ router/
 protocols/
 docker/ DOCKER.files

Generatíe su budu implementé cez tich ...