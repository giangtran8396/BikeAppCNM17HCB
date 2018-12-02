export const Authentoken = 'Authentoken';
export function setCookieToken(value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = Authentoken + "=" + (JSON.stringify(value) || "")  + expires + "; path=/";
}
export function getCookieToken() {
    var nameEQ = Authentoken + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0){
            var value = c.substring(nameEQ.length,c.length);
            if(value !== ""){
                return JSON.parse(value);
            }
        } 
    }
    return null;
}

export function delete_cookie() {
    document.cookie = 'Authentoken=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/;';
}