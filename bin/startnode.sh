cd `pwd`
cd ..
NODE_ENV=production node server/server.js >abc.log 2>&1 &
echo $! > bin/node_proc