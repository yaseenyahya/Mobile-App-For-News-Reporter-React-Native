import conf from "../conf.json";
export default {
  APIMediaEyePK: conf.MEDIAEYEPK,
  APIAjjEpes: conf.AAJEPES,
  self: this,
  callLoginApi: function(username, password) {
   
    return fetch(this.APIMediaEyePK + `Auth/${username}/${password}`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  },
  registerUser: function(fullName, city, mobile, email) {
    //console.log(this.APIAjjEpes + `registerUser/${fullName}/${city}/${mobile}/${email}`);
    return fetch(
      this.APIAjjEpes + `registerUser/${fullName}/${city}/${mobile}/${email}`,
      {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate"
        }
      }
    );
  },
  getSwitchAccountUsers: function() {
  
    return fetch(this.APIMediaEyePK + `allUsers`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  },
  getUploadID: function() {
    return fetch(this.APIAjjEpes + `getUploadID`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  },
  getReportsByUsernamePassword: function(username, password, dateFrom, dateTo) {

    return fetch(
      this.APIAjjEpes +
        `getReportsByUsernamePasswordApp/${username}/${password}/${-1}/${dateFrom}/${dateTo}`,
      {
        method: "GET"
      }
    );
  },
  addReport: function(
    username,
    password,
    message,
    newstype,
    subject,
    uploadfileserilize
  ) {
    let js = JSON.stringify({
      username: username,
      password: password,
      message: message,
      newstype: newstype,
      subject: subject,
      uploadfileserilize: uploadfileserilize == null ? "" : uploadfileserilize
    });
console.log(js);
    return fetch(
      this.APIAjjEpes +
        `AddReport`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: js
      }
    );
  }
};
