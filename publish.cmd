mkdir C:\published_game
mkdir C:\published_game\assets
mkdir C:\published_game\assets\murmurs

copy %~dp0deploy\* C:\published_game\
copy %~dp0src\assets\* C:\published_game\assets\
copy %~dp0src\assets\murmurs\* C:\published_game\assets\murmurs\
copy %~dp0src\index.html C:\published_game\index.html