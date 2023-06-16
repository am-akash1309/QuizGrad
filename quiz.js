const quizapp = angular.module("quizapp",['ui.router'])

var user = [{"name":"Nishikanth", "admin":"Test Admin"}]
var topic_user_selectec = ""
var newsGlobal = []

quizapp.controller("bot1", function($scope, $state, $http, $document){
    $document.ready(function() {
        var elems = document.querySelectorAll('.modal');
        var mod = M.Modal.init(elems);

        var elems = document.querySelectorAll('.sidenav');
        var sinav = M.Sidenav.init(elems);

        var elems = document.querySelectorAll('.collapsible');
        var collaps = M.Collapsible.init(elems);
    });

    $scope.username = ""
    $scope.news = []
    $scope.gotologin = () => {
        $state.go("login")
    }
    $scope.getnews = () => {
        $http({
            method:"GET",
            url:"https://am-akash1309-quiz-server.glitch.me/news"
        }).then (function(result){
            for (let i = 0; i < result.data.length; i++) {
                var object = result.data[i]
                $scope.news.push(object)
            }
        })
        newsGlobal = $scope.news
    }
})

quizapp.controller("bot2", function($scope, $state, $http){
    $scope.email = ""
    $scope.password = ""
    $scope.login_preloader = false

    $scope.verifyuser = () => {
        $scope.login_preloader = true
        $scope.message=""
        $http({
            method: "POST",
            url:"https://am-akash1309-quiz-server.glitch.me/verify_user/",
            data: {
                "email": $scope.email,
                "password": $scope.password
            }
        }).then (function(result){
            if (result.data.status=="ok"){
                user = []
                var obj = {
                    "name": result.data.name,
                    "DOB": result.data.DOB,
                    "email": result.data.email,
                    "password": result.data.password
                }
                user.push(obj)
            }
            if (result.data.status=="ok") {
                $scope.login_preloader = false
                $state.go("home")
            }
            else{
                $scope.login_preloader = false
                $scope.message=result.data.message
            }
        })
    }

    $scope.gotosignup = () => {
        $state.go("signup")
    }

    $scope.gotoforgotpassword = () => {
        $state.go("forgotpassword")
    }
})

quizapp.controller("bot3", function($scope, $state, $http, $document){
    if(user.length==0){
        $state.go("login")
    }
    else if (user[0].name==undefined){
        $state.go("login")
    }
    else{
        $scope.username = user[0].name

        $document.ready(function() {
            var elems = document.querySelectorAll('.modal');
            var instances = M.Modal.init(elems);

            var elems = document.querySelectorAll('.sidenav');
            var something = M.Sidenav.init(elems);

            var elems = document.querySelectorAll('.collapsible');
            var collaps = M.Collapsible.init(elems);
        });
    }

    $scope.news = []

    $scope.gotochoosetopic = () => {
        $state.go("choose_topic")
    }

    $scope.getnews = () => {
        if (newsGlobal.length==0){
            $http({
                method:"GET",
                url:"https://am-akash1309-quiz-server.glitch.me/news"
            }).then (function(result){
                console.log(result.data)
                for (let i = 0; i < result.data.length; i++) {
                    var object = result.data[i]
                    $scope.news.push(object)
                }
            })
            console.log($scope.news)
            newsGlobal = $scope.news
        }
        else {
            $scope.news = newsGlobal
        }
    }
})

quizapp.controller("bot3.5", function($scope, $state, $http, $document){
    if(user.length==0){
        $state.go("login")
    }
    else if (user[0].name==undefined){
        $state.go("login")
    }
    else{
        $scope.username = user[0].name
        $scope.chosseTopicPreloader = false
        $scope.NoTopicToDisplay = true
        $scope.news = newsGlobal

        $document.ready(function() {
            var elems = document.querySelectorAll('.modal');
            var instances = M.Modal.init(elems);

            var elems = document.querySelectorAll('.sidenav');
            var something = M.Sidenav.init(elems);

            var elems = document.querySelectorAll('.collapsible');
            var collaps = M.Collapsible.init(elems);
        });

        $http({
            method:"GET",
            url:"https://am-akash1309-quiz-server.glitch.me/get_topics/"
        }).then (function(result){
            $scope.chosseTopicPreloader = true
            if (result.length==0) {
                $scope.chossetopicifnotopicindatabase = false
                $scope.NoTopicToDisplay = false
            }else{
                $scope.chossetopicifnotopicindatabase = true

                for (let i = 0; i < result.data.length; i++) {
                    var object = result.data[i].name
                    $scope.topics.push(object)
                }
            }
        })
    }

    $scope.topics = []

    $scope.startquiz = (topic) => {
        topic_user_selectec = topic
        $state.go("quiz")
    }
})

quizapp.controller("bot4", function($scope, $state, $http){
    $scope.name=""
    $scope.email=""
    $scope.dob = ""
    $scope.password=""
    $scope.confirmpassword=""

    $scope.signupPagePreloader = true

    $scope.signup_user = () => {
        $scope.signupPagePreloader = false
        $scope.message = ""

        $http({
            method: "POST",
            url:"https://am-akash1309-quiz-server.glitch.me/register_user/",
            data: {
                "name": $scope.name,
                "email": $scope.email,
                "dob": $scope.dob,
                "password": $scope.password,
                "confirmpassword": $scope.confirmpassword
            }
        }).then (function(result){
            $scope.signupPagePreloader = true
            if (result.data.status=="ok"){
                user=[]
                var obj = {
                    "name": result.data.name,
                    "DOB": result.data.DOB,
                    "email": result.data.email,
                    "password": result.data.password
                }
                user.push(obj)

                M.toast({
                    "html": result.data.message,
                    "classes": "green rounded"
                })
            }
            if (result.data.status=="ok"){
                $state.go("home")
            }
            else{
                $scope.message = result.data.message
            }
        })
        
    }
})

var tempQ = []
var tempA = []
var totalscore = 0
quizapp.controller("bot5", function($scope, $http, $state, $document){
    $document.ready(function() {
        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems);

        var elems = document.querySelectorAll('.sidenav');
        var something = M.Sidenav.init(elems);

        var elems = document.querySelectorAll('.collapsible');
        var collaps = M.Collapsible.init(elems);
    });

    if(user.length==0){
        $state.go("login")
    }
    else if (user[0].name==undefined){
        $state.go("login")
    }
    else if (topic_user_selectec==""){
        $state.go("home")
    }
    else{
        $scope.username = user[0].name
        $scope.quizStarted_init = false
        $scope.news = newsGlobal

        $http({
            method:"POST",
            url:"https://am-akash1309-quiz-server.glitch.me/getquestions",
            data: {
                "topic":topic_user_selectec
            }
        }).then (function(result){
            $scope.quizStarted_init = true

            for (let i = 0; i < result.data.length; i++) {
                var object = result.data[i]
                $scope.questions.push(object)
                tempQ.push(object)
            }

            question_no = $scope.slide + 1
            $scope.progress = ((question_no)/$scope.questions.length)*100
        }) 
    }

    $scope.slide=0
    $scope.questions = []
    $scope.answer = {}

    $scope.getanswer = () => {
        $scope.answerlist=[]
        tempA = []
        for (let i = 0; i < $scope.questions.length; i++) {
            if ($scope.answer[i]==undefined) {
                $scope.answer[i]=""
            }
            $scope.answerlist.push({"answer":$scope.answer[i]})
            tempA.push({"yourAnswer":$scope.answer[i]})
        }
    }
    $scope.beforeslide = () => {
        $scope.slide -= 1
        question_no -= 1
        $scope.progress = ((question_no)/$scope.questions.length)*100
    }
    $scope.nextslide = () => {
        $scope.slide += 1
        question_no += 1
        $scope.progress = ((question_no)/$scope.questions.length)*100
    }

    $scope.gotoscore = () => {
        $state.go("score")
    }
    $scope.marks = totalscore
    $scope.validate = () => {
        $scope.getanswer()
        $scope.marks = 0
        for (let i = 0; i < $scope.questions.length; i++) {
            if ($scope.questions[i].answer == $scope.answerlist[i].answer) {
                $scope.marks+=1
            }
        }

        totalscore = $scope.marks
    }
    $scope.complete = () => {
        $state.go("home")
    }
    $scope.checkanswers = () => {
        $state.go("answers")
    }
})

quizapp.controller("bot6", function($scope, $http, $state){
    $scope.name=""
    $scope.email=""
    $scope.dob=""
    $scope.password=""
    $scope.confirmpassword=""


    $scope.changepassword_hide = true
    $scope.forgotPasswordPreloader = false

    $scope.forgot_password = () => {
        $scope.forgotPasswordPreloader = true
        $scope.message = ""
        $http({
            method: "POST",
            url:"https://am-akash1309-quiz-server.glitch.me/check_dob_of_email",
            data: {
                "email": $scope.email,
                "dob": $scope.dob
            }
        }).then (function(result){
            $scope.forgotPasswordPreloader = false
            if (result.data.status=="ok"){
                $scope.changepassword_hide = false
                $scope.message = ""
                $scope.name = result.data.name
            }
            else{
                $scope.message = result.data.message
            }
        })
    }
    $scope.change_password= () => {
        $scope.forgotPasswordPreloader = true
        $scope.message = ""
        $http({
            method: "POST",
            url:"https://am-akash1309-quiz-server.glitch.me/change_password",
            data: {
                "name": $scope.name,
                "email": $scope.email,
                "dob": $scope.dob,
                "password": $scope.password,
                "confirmpassword": $scope.confirmpassword
            }
        }).then (function(result){
            $scope.forgotPasswordPreloader = false
            if (result.data.status=="ok"){
                M.toast({
                    "html": result.data.message,
                    "classes": "green rounded"
                })
            }
            if (result.data.status=="ok"){
                $state.go("login")
            }
            else{
                $scope.message = result.data.message
            }
        })
    }
})

quizapp.controller("bot7", function($scope, $state, $http){
    $scope.email = ""
    $scope.password = ""
    $scope.dob = ""

    $scope.verifyadmin = () => {
        $http({
            method: "POST",
            url:"https://am-akash1309-quiz-server.glitch.me/verify_admin",
            data: {
                "email": $scope.email,
                "password": $scope.password,
                "dob": $scope.dob
            }
        }).then (function(result){
            if (result.data.status=="ok"){
                user=[]
                var obj = {
                    "admin": result.data.name,
                    "DOB": result.data.DOB,
                    "email": result.data.email,
                    "password": result.data.password
                }
                user.push(obj)
                M.toast({
                    "html": result.data.message,
                    "classes": "green"
                })
            }
            if (result.data.status=="ok") {
                $state.go("adminpage")
            }
            else{
                $scope.message=result.data.message
            }
        })
    }
})

quizapp.controller("bot8", function($scope, $state, $http){
    if (user.length==0){
        $state.go("adminlogin")
    }
    else if (user[0].admin==undefined){
        $state.go("adminlogin")
    }
    else{
        $scope.adminname = user[0].admin
    }

    $scope.addquestions = () => {
        $state.go("addquestions")
    }

    $scope.deletequestions = () => {
        $state.go("deltopic")
    }
})

quizapp.controller("bot9", function($scope, $state, $http){
    if(user.length==0){
        $state.go("adminlogin")
    }
    else if (user[0].admin==undefined){
        $state.go("adminlogin")
    }
    else{
        $scope.adminname = user[0].admin
    }

    $scope.input_question = []
    let dummy = {}

    $scope.topic = ""
    $scope.question = ""
    $scope.option1 = ""
    $scope.option2 = ""
    $scope.option3 = ""
    $scope.option4 = ""
    $scope.answer = ""

    $scope.addbtn = false
    $scope.donebtn = false
    $scope.addquesrow = false

    $scope.topicfilled = () => {
        if($scope.topic!=""){
            $scope.addbtn = true
            $scope.donebtn = true
            $scope.addquesrow = true
        }
        else{
            $scope.addbtn = false
            $scope.donebtn = false
            $scope.addquesrow = false
        }
    }

    $scope.addques = () => {
        if ($scope.question=="" || $scope.option1 == "" || $scope.option2 == "" || $scope.option3 == "" || $scope.option4 == "" || $scope.answer == ""){
            M.toast({
                "html":"Please fill out all the fields.",
                "classes": "red"
            })
        }
        else{
            dummy = {
                "question" : $scope.question,
                "option1": $scope.option1,
                "option2": $scope.option2,
                "option3": $scope.option3,
                "option4": $scope.option4,
                "answer": $scope.answer
            }
            $scope.input_question.push(dummy)
            dummy={}
            $scope.question = ""
            $scope.option1 = ""
            $scope.option2 = ""
            $scope.option3 = ""
            $scope.option4 = ""
            $scope.answer = ""
        }
    }

    $scope.done = () => {
        if ($scope.question=="" || $scope.option1 == "" || $scope.option2 == "" || $scope.option3 == "" || $scope.option4 == "" || $scope.answer == ""){
            M.toast({
                "html":"Please fill out all the fields.",
                "classes": "red"
            })
        }
        else{
            dummy = {
                "question" : $scope.question,
                "option1": $scope.option1,
                "option2": $scope.option2,
                "option3": $scope.option3,
                "option4": $scope.option4,
                "answer": $scope.answer
            }
            $scope.input_question.push(dummy)
            
            $http({
                method: "POST",
                url:"https://am-akash1309-quiz-server.glitch.me/add_question_collection",
                data: {
                    "topic": $scope.topic,
                    "questions": $scope.input_question
                }
            }).then (function(result){
                if(result.data.status=="ok"){
                    M.toast({
                        "html": "Topic added successfully",
                        "classes": "green"
                    })
                }
                $state.go("adminpage")
            })
        }
    }
})

quizapp.controller("bot10", function($scope, $state, $http){
    if(user.length==0){
        $state.go("adminlogin")
    }
    else if (user[0].admin==undefined){
        $state.go("adminlogin")
    }
    else{
        $scope.adminname = user[0].admin

        $http({
            method:"GET",
            url:"https://am-akash1309-quiz-server.glitch.me/get_topics"
        }).then (function(result){
            for (let i = 0; i < result.data.length; i++) {
                var object = result.data[i].name
                $scope.topics.push(object)
            }
        })
    }

    $scope.topics = []

    $scope.delete = (topic) => {

        $http({
            method: "POST",
            url:"https://am-akash1309-quiz-server.glitch.me/delete_collection",
            data: {
                "topic": topic
            }
        }).then (function(result){
            if(result.data.status=="ok"){
                M.toast({
                    "html": "Topic deleted successfully",
                    "classes": "red"
                })
            }
            $state.go("adminpage")
        })
    }
})

quizapp.controller("bot11", function($scope, $state, $http, $document){
    $scope.QuestionWithAnswer = []
    $document.ready(function() {
        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems);

        var elems = document.querySelectorAll('.sidenav');
        var something = M.Sidenav.init(elems);

        var elems = document.querySelectorAll('.collapsible');
        var collaps = M.Collapsible.init(elems);
    });
    
    if(user.length==0){
        $state.go("login")
    }
    else if (user[0].name==undefined){
        $state.go("login")
    }
    else if (topic_user_selectec==""){
        $state.go("choose_topic")
    }
    else{
        $scope.username = user[0].name
        $scope.news = newsGlobal

        $scope.QuestionWithAnswer = [];

        for (let i = 0; i < tempA.length; i++) {
            let mergedObject = { ...tempQ[i], "yourAnswer": tempA[i].yourAnswer };
            $scope.QuestionWithAnswer.push(mergedObject);
        }
    }
    $scope.gohome = () => {
        tempQ = []
        $state.go("home")
    }
    $scope.getStyle = function(index, opt) {
        if ($scope.QuestionWithAnswer[index].answer == $scope.QuestionWithAnswer[index].yourAnswer && $scope.QuestionWithAnswer[index].yourAnswer == opt){
            return {'background-color': 'lightgreen'}
        }
        else if ($scope.QuestionWithAnswer[index].answer != $scope.QuestionWithAnswer[index].yourAnswer && $scope.QuestionWithAnswer[index].yourAnswer == opt){
            return {'background-color': 'rgb(245, 148, 148)'}
        }
        else if ($scope.QuestionWithAnswer[index].yourAnswer == "" && $scope.QuestionWithAnswer[index].answer == opt){
            return {'background-color': 'lightblue'}
        }
        else if ($scope.QuestionWithAnswer[index].answer != $scope.QuestionWithAnswer[index].yourAnswer && $scope.QuestionWithAnswer[index].answer == opt){
            return {'background-color': 'lightgreen'}
        }
    }
    $scope.crt_comment = function(index){
        if ($scope.QuestionWithAnswer[index].answer == $scope.QuestionWithAnswer[index].yourAnswer){
            return true
        }
        else {
            return false
        }
    }
    $scope.wrong_comment = function(index){
        if ($scope.QuestionWithAnswer[index].answer != $scope.QuestionWithAnswer[index].yourAnswer && $scope.QuestionWithAnswer[index].yourAnswer!=""){
            return true
        }
        else {
            return false
        }
    }
    $scope.unans_comment = function(index){
        if ($scope.QuestionWithAnswer[index].yourAnswer==""){
            return true
        }
        else {
            return false
        }
    }
})

quizapp.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
    .state("main",{
        url: "/",
        templateUrl:"./loading_page.html",
        controller: "bot1"
    })
    .state("login",{
        url: "/Login",
        templateUrl:"./login_or_signup_page.html",
        controller: "bot2"
    })
    .state("home",{
        url: "/Home",
        templateUrl:"./home_page.html",
        controller: "bot3"
    })
    .state("choose_topic",{
        url: "/Choose Topic",
        templateUrl:"./choose_topic.html",
        controller: "bot3.5"
    })
    .state("signup",{
        url: "/SignUp",
        templateUrl:"./signup.html",
        controller: "bot4"
    })
    .state("quiz",{
        url: "/Quiz",
        templateUrl:"./quiz_started.html",
        controller: "bot5"
    })
    .state("score",{
        url: "/Score",
        templateUrl:"./score_page.html",
        controller: "bot5"
    })
    .state("forgotpassword",{
        url: "/Change Password",
        templateUrl:"./forgot_password.html",
        controller: "bot6"
    })
    .state("adminlogin",{
        url: "/Admins",
        templateUrl:"./admin_login.html",
        controller: "bot7"
    })
    .state("adminpage",{
        url: "/Admin Page",
        templateUrl:"./admin_page.html",
        controller: "bot8"
    })
    .state("addquestions", {
        url: "/Add Questions",
        templateUrl:"./add_questions.html",
        controller: "bot9"
    })
    .state("deltopic", {
        url: "/Delete Topic",
        templateUrl:"./del_topic.html",
        controller: "bot10"
    })
    .state("answers",{
        url: "/Check Answers",
        templateUrl: "./check_answers.html",
        controller: "bot11"
    })
    $urlRouterProvider.otherwise("/")
})