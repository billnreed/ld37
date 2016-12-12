mkdir C:\published_game
mkdir C:\published_game\assets
yarn run production
copy %~dp0\dist\* C:\published_game\
copy %~dp0\src\assets\* C:\published_game\assets\
