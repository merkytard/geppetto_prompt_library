# tk_geppetto_dashboard.py

import tkinter as tk
from tkinter import messagebox, scrolledtext
import socket
import requests
from server_handler import ServerHandler
from api_manager import APIManager
import threading

PORTS_TO_CHECK = [3000, 5000, 8000, 7860]

class GeppettoDashboard(tk.Tk):
    def __init__(self):
        super().__init__()

        self.title("Geppetto Local Dashboard")
        self.geometry("700x600")
        self.configure(bg="#111111")

        self.server_handler = ServerHandler()
        self.api_manager = APIManager()

        # API Key Section
        tk.Label(self, text="OpenAI API Key:", bg="#111", fg="#0f0").pack(pady=5)
        self.api_key_entry = tk.Entry(self, width=70)
        self.api_key_entry.pack(pady=5)

        tk.Button(self, text="Set API Key", command=self.set_api_key).pack(pady=5)
        tk.Button(self, text="Test API Key", command=self.test_api_key).pack(pady=5)

        # Server Control Section
        tk.Label(self, text="Server Control:", bg="#111", fg="#0f0").pack(pady=5)
        tk.Button(self, text="Start Server", command=self.threaded_start_server).pack(pady=5)
        tk.Button(self, text="Stop Server", command=self.stop_server).pack(pady=5)

        # Server Status Section
        tk.Label(self, text="Local Servers:", bg="#111", fg="#0f0").pack(pady=5)
        self.server_status = scrolledtext.ScrolledText(self, width=80, height=10, bg="#222", fg="#eee")
        self.server_status.pack(pady=5)

        # Logs Output
        tk.Label(self, text="Logs:", bg="#111", fg="#0f0").pack(pady=5)
        self.logs = scrolledtext.ScrolledText(self, width=80, height=10, bg="#222", fg="#eee")
        self.logs.pack(pady=5)

        # Auto Scan
        self.auto_scan()

    def auto_scan(self):
        self.scan_servers()
        self.after(5000, self.auto_scan)  # Auto-scan every 5 seconds

    def scan_servers(self):
        self.server_status.delete('1.0', tk.END)
        for port in PORTS_TO_CHECK:
            if self.is_port_open("127.0.0.1", port):
                self.server_status.insert(tk.END, f"✅ Port {port} is open (server running)\n")
            else:
                self.server_status.insert(tk.END, f"❌ Port {port} is closed\n")

    def is_port_open(self, host, port):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(0.5)
        try:
            s.connect((host, port))
            s.close()
            return True
        except:
            return False

    def set_api_key(self):
        key = self.api_key_entry.get().strip()
        if not key:
            messagebox.showwarning("Warning", "Please enter an API key!")
            return
        self.api_manager.set_api_key(key)
        self.logs.insert(tk.END, "🔑 API Key set.\n")

    def test_api_key(self):
        success, message = self.api_manager.test_api_key()
        if success:
            self.logs.insert(tk.END, f"✅ {message}\n")
        else:
            self.logs.insert(tk.END, f"❌ {message}\n")

    def threaded_start_server(self):
        threading.Thread(target=self.start_server, daemon=True).start()

    def start_server(self):
        self.server_handler.start_server()
        self.logs.insert(tk.END, "🚀 Server started on port 3000.\n")

    def stop_server(self):
        self.server_handler.stop_server()
        self.logs.insert(tk.END, "🛑 Server stopped.\n")

if __name__ == "__main__":
    app = GeppettoDashboard()
    app.mainloop()