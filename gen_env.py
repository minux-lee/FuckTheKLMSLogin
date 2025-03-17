import json

def gen_env_file(moodle_session: str):
    env_file = open("server/.env", "w")
    env_file.write(f"MOODLE_SESSION={moodle_session}")
    env_file.close()

    config_file = open("extension/config.json", "w")
    config = {
        'MOODLE_SESSION': moodle_session
    }

    config_file.write(json.dumps(config))
    config_file.close()

print("Enter your moodle session:")
moddle_session = input()
gen_env_file(moddle_session)

