import json

def gen_env_file(moddle_session: str):
    env_file = open("server/.env", "w")
    env_file.write(f"MODDLE_SESSION={moddle_session}")
    env_file.close()

    config_file = open("config.json", "w")
    config = {
        'MOODLE_SESSION': moddle_session
    }

    config_file.write(json.dumps(config))
    config_file.close()

print("Enter your moodle session:")
moddle_session = input()
gen_env_file(moddle_session)

