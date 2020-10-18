module.exports = {
   root: true,
   modules: {
       "bem-tools": {
           plugins: {
               create: {
               techs: ["html", "scss", "js"],
                   levels: {
                       "app/blocks/modules": {
                           default: true
                       },
                       "app/blocks/components": {
                        default: true
                    }
                   }
               }
           }
       }
   }
};