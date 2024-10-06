"""
File: run.py
Authors:
    - Deepti Bhat
"""
import os

def create_desktop_launcher(name, command, icon=None):
    current_directory = os.path.dirname(os.path.abspath(__file__))  # Get the current directory of the script
    desktop_file_path = os.path.join(current_directory, f'{name}.desktop') # Get the path to the desktop file

    with open(desktop_file_path, 'w') as desktop_file:
        desktop_file.write(f'[Desktop Entry]\n')
        desktop_file.write(f'Type=Application\n')
        desktop_file.write(f'Name={name}\n')
        if icon:
            desktop_file.write(f'Icon={icon}\n')
        desktop_file.write(f'Exec=gnome-terminal -- bash -c "cd {current_directory} && {command}; exec bash"\n')
        desktop_file.write(f'Terminal=true\n')

    os.chmod(desktop_file_path, 0o755)  # Make the file executable
current_directory = os.getcwd()
relative_path = './lhedgeicon.png' # Relative Path to the icon file
absolute_path = os.path.abspath(os.path.join(current_directory, relative_path)) # Absolute Path to the icon file
create_desktop_launcher('Lhedge', 'sudo npx nw .', icon=absolute_path) # Create the desktop launcher

print(f"Desktop launcher 'Lhedge.desktop' created successfully in {os.getcwd()}!")

