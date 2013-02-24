{exec} = require 'child_process'
task 'sbuild', 'Build project', ->
  exec 'coffee -cb -o routes/ routes/', (err, stdout, stderr) ->
    throw err if err
    console.log stdout + stderr

  exec 'coffee -cb -o mailer/ mailer/', (err, stdout, stderr) ->
    throw err if err
    console.log stdout + stderr