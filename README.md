# Crowd-Sourced-Travel-Planner

## Description
Welcome!! This app aims to allow users to plan their trips by adding experiences from previous travelers and locals. 

## Work Qaulity and Guidelines
*Tests:* Unit tests should be implemented for all backend features. Testing should be a combination of Unit Tests (testing framework to be determined) and manual tests. 

*Linting:* A linter will be used to enforce coding standards. Clean coding practices should be maintained at all times.

*PRs:* All PRs merged into the main branch must be approved by at least one team member. Before merging and code changes, ensure that all related unit tests pass. Feature branches should be named using the format:  ticket-{#}/{description}.

*Pair-programming:* If a member encounters difficulties or needs assistance with debugging, they can schedule time with other team members or ask for help during office hours.

*Bugs:* Members are responsible for reporting bugs by creating tickets on Jira and discussing them in the next team meeting.

## Personal Access Token 
If any member chooses to use a graphical user interface (GUI) to interact with GitHub, they will need to set up their personal access token. Please refer to the instructions below to configure the necessary permissions for your personal access token.

<img width="611" alt="Screenshot 2024-10-14 at 9 33 00 PM" src="https://github.com/user-attachments/assets/db26df2e-fe0d-44d8-8aea-e9ceafbaea93">

## Local Setup and Startup
 
**Flask - Backend
- Set up Virtual Enviornemnt: 
1. Install virtual enviornment: ```sudo apt install python3.10-venv```
2. Activate it: 
    ```python3 -m venv venv```
    ```source venv/bin/activate```
3. Install packages:```pip install -r requirements.txt```
4. Run Flask: ```python3 app.py``` 

**React - Frontend
- Open src/App.js in the frontend/ directory 
- Install Packages  ```npm install``
- Run the React app in Developement mode```npm run dev```

**Optional - Build React for Production
- Inside the frontend/ directory, run: ```npm run build```
