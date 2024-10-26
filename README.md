Clone the project, then in Visual Studio right click on the Solution and choose "Configure Startup Projects":
![image](https://github.com/user-attachments/assets/f477351e-32be-433a-8025-f269fb0681d8)

Choose the radio button for Multiple startup projects, then for both client and server, set the action to "Start". Use the arrow keys to have the Server project start before the client, like so:
![image](https://github.com/user-attachments/assets/99160d7a-9909-4ab7-81f2-1173d9a5f38b)

Hit Apply and then Ok.

Right click on the CollegeFootballStats.Server project and choose "Manage User Secrets":

![image](https://github.com/user-attachments/assets/690db06f-f3af-4a64-a7bd-03f1e610a311)

In the secrets.json file that is created, add a ConnectionStrings::UFOracle entry:

![image](https://github.com/user-attachments/assets/1ded6729-3adb-420c-b78e-eed0253a3596)

Run the app and you should get 2 browsers, one with a Vite UI and a backend API with a Swagger Page.

