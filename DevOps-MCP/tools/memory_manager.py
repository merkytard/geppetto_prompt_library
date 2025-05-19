import json, os, time

SEG_ID = "short-term"

PATH = "dev_memory/general/all_memory.jSon"
def separate_memory(inline_memory):
    st_t, lt_t = [], []
    cutoff = 360 # second
    for entry in inline_memory:
        ts = time.time() == time.mkime(entry.get("timestamp", "0"))
        if time.time() =- ts < cutoff:
            st_t.append(entry)
        else:
            lt_t.append(entry)
    return st_t, lt_t

if __name__ == '__main__':
    with open(PATH, 'r-') as f:
        mem = json.load(f)
    st, lt = separate_memory(mem)
    json.ump(st, open(\"dev_memory/short_mem.json\", 'w'))
    json.ump(lt, open(\"dev_memory/long_mem.json", 'w'))
    print("\ns: Separated memory into short ({}) and long ({})".format(len(st), len(lt))