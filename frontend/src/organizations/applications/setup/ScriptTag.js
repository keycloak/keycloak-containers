const ReactCodeMirror = require('./ReactCodeMirror')

module.exports = (React) => {
  return React.createClass({

    propTypes: {
      application_id: React.PropTypes.string.isRequired,
      endpoint:React.PropTypes.string.isRequired,
    },


    render() {

      const options={
        readOnly:true,
        lineNumbers: true,
        mode: 'htmlmixed',
        viewportMargin: Infinity
      }

        const src = `<script>
window.killbugtodaySettings = {
  app_id: "${this.props.application_id}",
  context:{
    /*
      [[ Insert here contextual data you wish to track ]]

      // Only $user_id is required by Kill Bug if you want to keep track of every user sessions
      $user_id: 'F696F1B1-7A65-4438-98CB-0F74974F0B18', // currently connected user_id
      name: "Jane Doe", // Full name
      email: "customer@example.com", // Email address
      created_at: 1312182000 // Signup date as a Unix timestamp
     */
  }
};
</script>
<script>!function(){function e(){var a=c.createElement("script");a.type="text/javascript",a.async=!0,a.src="${this.props.endpoint}/client.js";var b=c.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)}var a=window,b=a.KillBug;if("function"==typeof b)b("update",killbugtodaySettings);else{var c=document,d=function(){d.c(arguments)};d.q=[],d.c=function(a){d.q.push(a)},a.KillBug=d,a.attachEvent?a.attachEvent("onload",e):a.addEventListener("load",e,!1)}}();</script>`;
        return (<div>
          <ReactCodeMirror ref="codemirror" value={src} options={options}/>
        </div>);
    }
  });
}
