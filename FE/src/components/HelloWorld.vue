<template>
  <div class="hello">
    <h2>Essential Links</h2>
    <div>
      <select v-model="selected">
      <option v-for="user in lst" :key="user" :value="user">{{user}}</option>
    </select>
    </div>
    <div>
      <input type="text" v-model="text"/>
    </div>
    <button v-on:click="sendMess()">SEND</button>
    <ul id="ulEle">
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      selected: '',
      text: '',
      mess: '',
      lst: [],
    }
  },
  sockets: {
    connect: function () {
        console.log('socket connected')
    },
    listUser: function (data) {
        this.lst = data;
        var index = -1;
        for (var i = 0 ; i < this.lst.length ; i++){
            if(this.lst[i] == this.$socket.id){
              index = i;
              break;
            }
        }
        this.lst.splice(index*1,1);
    },
    'clientreciverMess'(data){
        var liEle = document.createElement('li');
        liEle.innerHTML = data;
        var ulEle = document.getElementById('ulEle');
        ulEle.appendChild(liEle);
    }
  },
  methods: {
    sendMess() {
      var self = this;
      this.$socket.emit('clientsendMess',self.selected,self.text);
      self.text = '';
    }
  },
  created(){
      this.$socket.emit('join','giang');
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
