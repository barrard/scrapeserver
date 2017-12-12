 var mkdirp = require('mkdirp');
 var express = require('express');
 var app = express();

 app.use(express.static('client'));

app.set('port', 8083)


 app.get('/', function(req, res){
  console.log('/')
  res.sendFile('./client/index.html')
 })

 app.get('/scrape', function(req, res){
  console.log('/scrape')
  res.sendFile('./client/index.html')
 })


    app.get('/scrape/:url', function(req, res){
      console.log(req.params.url)
      var twilli_path = '/home/sailor/templates/login_pages/register_login/'
      var certFile = '/home/sailor/meetapp/meetupBackup/ssl/ca-crt.pem'
      var keyFile = '/home/sailor/meetapp/meetupBackup/ssl/ca-key.pem'
      var index_file_name = 'index.html'
      var options = {
        url: url,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19'
        },
         agentOptions: {
             cert: fs.readFileSync(certFile),
             key: fs.readFileSync(keyFile),
             // Or use `pfx` property replacing `cert` and `key` when using private key, certificate and CA certs in PFX or PKCS12 format:
             // pfx: fs.readFileSync(pfxFilePath),
             passphrase: 'password',
             securityOptions: 'SSL_OP_NO_SSLv3'
         }
      };
      var root_url = url.split('/').slice(0,-1).join('/')+'/'
          console.log(url)
          request(options, function(error, response, body) {
              if (!error && response.statusCode === 200) {
                  if (body) {
                       //res.send(body)
                      var chee = cheerio.load(body)
                      //console.log(chee)
                      console.log('---------------------------------')
                      var links = chee('link')
                      var imgs = chee('img')
                      var other_imgs = chee('data-img-src')
                      var all_tags = chee('*')
                      var scripts = chee('script')
                      function get_resources(tags, attr){
                        for(var x = 0 ; x < tags.length ; x++){
                          let href = chee(tags[x]).attr(attr)
                          //determin if its an image for the binary method
                          var ext;
                          if(href){
                            if (href.startsWith('http')){continue}
                            ext = href.split('.').slice(-1).join().toLowerCase()
                            console.log(href)

                            console.log(ext)
                            console.log(ext)
                            console.log(ext)
                            console.log(ext)
                            console.log(ext)
                            console.log(ext)
                            console.log(href)

                            if(ext === 'png' || ext === 'jpg' || ext === 'gif'){
                              options.encoding='binary'
                              options.url = root_url+href
                              request(options, function(error, response, body) {
                                if (!error && response.statusCode === 200) {
                                  console.log('no error and response is 200')
                                  if (body) { 
                                    console.log('body we got')
                                    write_file(body, href, 'binary')

                                  }
                                }else{
                                 console.log('WTF BINARY??')
                                 console.log(options.url)
                                 console.log(error)
                                 // console.log(response)
                                }
                              });
                            }else{
                              options.encoding=undefined
                              options.url = root_url+href
                              request(options, function(error, response, body) {
                                if (!error && response.statusCode === 200) {
                                  console.log('no error and response is 200')
                                  if (body) { 
                                    console.log('body we got')
                                    write_file(body, href)

                                  }
                                }else{
                                  console.log('WTF text??')
                                  console.log(options.url)
                                  console.log(error)
                                  // console.log(response)
                                  // console.log(body)
                                }
                              })
                            }

                          }





                        }

                      }

                      function write_file(body, href, binary){
                        if(binary){
                          console.log('BINARY IMAGE I ASSUME')
                          fs.writeFile(twilli_path+href, body, 'binary', function(err) {
                            huh(err, body, href)
                          })
                        }else{
                          fs.writeFile(twilli_path+href, body, function(err) {
                            console.log('CSS?? or JS?')

                            huh(err, body, href)


                          })
                        }

                      }


                      get_resources(imgs, 'src')
                      get_resources(links, 'href')
                      get_resources(all_tags, 'data-custom-background-img')
                      get_resources(scripts, 'src')

                      function huh(err, body, href){
                        if(err){
                          console.log(err)
                          if(err.errno === -2){
                            console.log('we need to create this DIRRR')
                            let dir_path = href.split('/')
                            console.log(dir_path)
                            // dir_path.shift()
                            console.log(dir_path)
                            dir_path = dir_path.slice(0,-1)
                            console.log(dir_path)
                            dir_path=dir_path.join('/')
                            console.log(dir_path)
                            mkdirp(twilli_path+dir_path, (err)=>{
                              if(err){console.log('+++    we cannot make the DIRRRRR   ++++')}
                                else{
                                  console.log('dir made, lets re write the filessssss')
                                  write_file(body, href)
                                }
                            })
                          }
                        }
                        else{
                          console.log('files saved @ '+twilli_path+href)
                        }
                      }


                      write_file(body, index_file_name)




                  } else {
                      console.log('no body')
                      socket.emit('serverResponse', 'no body')
                  }
              }else if(error){
                socket.emit('serverResponse', 'error '+error)
                console.log('error '+error)
                  for (var k in error){
                console.log(k+' : '+error[k])
      }
              }else if (response){
                socket.emit('serverResponse', 'response '+response)
                console.log('response '+response)
                for (var k in response){
                  console.log(k+' : '+response[k])
      }
              }
          })




    })//scrape


  app.listen(app.get('port'), ()=> console.log('listening on port '+app.get('port')))
