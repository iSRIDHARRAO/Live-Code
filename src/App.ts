import {Stage, Chat, Modal, Storage, Streams, Users, PubSub} from '@livestorm/plugin'
export default function() {


Stage.Buttons.registerShareButton({
  label: 'Live-Code',
  imageSource: 'https://livestorm-ireland-plugin-assets.s3-eu-west-1.amazonaws.com/6029a1bb-5680-4435-821f-f16d5d39a33c/logo.png',
 // Not called if iframe option is specified
 onClick:  () =>Modal.showIframe({

    template: require("./template.html").default,

    variables: { abc:"abc" },


    onMessage: async ({message,change}) => {
      await Storage.setItem('key',`${message}`)
        if(change!="registered"){
          Chat.broadcast({
          text: `${message}`,      
        })
        }
        else{
          pub(message)
        }
    },
    size: 'extraLarge',
    
  
  })
})

function pub( message){
 PubSub.publish('show-modal',{ data: {content : `${message}`} })
}

PubSub.subscribe('show-modal', async (variables) => {
  const modal = await Modal.showIframe({
    template: require("./template1.html").default,
    variables: { content: `${variables.content}` },
      onMessage: ({message,change}) => {
        if(change=="no"){
                    Chat.broadcast({
                      text: `${message}`,      
                    })
                  }
                  else{
                    

                
                    PubSub.publish('modal-change',{ data: {"message" : `${message}`,  }
                } )
              }         
          

      },
      size: 'extraLarge',
  })

  PubSub.subscribe('modal-change', content => modal.sendMessage( content ))
})
}