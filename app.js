
//3 IMMEDIATE INVOKED FUNCTIONs EXECUTE/IIFE
var BudgetController = (function(){
    
    //FUNCTION CONSTRUCTORS
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else{
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }
    
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[type] = sum;
    };

    
    //CREATING DATA STRUCTURE TO STORE DATAS
    //SORTING EVERYTHING INTO THE DATA, ALLITEMS CONSIST OF
    // EXP AND INC, AND TOTALS OF EXP AND INC .
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }
    
    return {
        addItem: function(type, des, val){
            var newItem;
            
            //determines the last ID array -1 because arrays starts from 0, from 0-1-2-3 etc.. so to the determine the last it will be added +1 since you added latest item;
            //CREATES NEW ID
            //the second square bracket after [type] is the location in the array so -1 and adds .id to determine it as an ID + 1, since its the latest
            
            if(data.allItems[type].length > 0){
               ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else{
                ID = 0;
            }
            
            
            //create new item determines either 'inc' or 'exp' type
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            }else if (type === 'inc'){
                newItem = new Income(ID, des, val);
                
            }
            
            //push it into our data structure
            data.allItems[type].push(newItem);
            
            // returns the new element/item
            return newItem;
        },

        deleteItem: function(type, id){
            var ids, index;

            //map acts like a foreach for the arrays of data
            // id = 6
            //data.allItems[type][id];
            // ids = [1 2 4 6 8]
            //index = 3

            ids = data.allItems[type].map(function(current){
                return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index, 1)
            }

        },

        calculateBudget: function(){

            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            data.budget = data.totals.inc - data.totals.exp;

            //calculate the budget: income - expenses
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100); 
            }else{
                data.percentage = -1;
            }


            //calculate percentage of income that was spent

        },

        calculatePercentages: function(){

            data.allItems.exp.forEach(function(curr){
                curr.calcPercentage(data.totals.inc);
            });

        },

        getPercentages: function(){

            var allPerc = data.allItems.exp.map(function(cur){
               return cur.getPercentage(); 
            });

            return allPerc;

        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        }
        
    };
    
        
    
})();


var UIController = (function(){
    
    var DOMstrings = { // putting all classes together in a single var object for easy replacement 
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputVal: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        container: '.container',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        expensesPercLabel: '.item__percentage'
    }
    
    return {
        getInput: function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value, // either inc or exp.
                description: document.querySelector(DOMstrings.inputDesc).value,
                value: parseFloat(document.querySelector(DOMstrings.inputVal).value)
            };
        },

        addListItem: function(obj, type){

            var html, newHtml, element;
            // CREATE HTML STRING WITH PLACEHOLDER TEXT

            if(type === 'inc') {

                //changing the values to a placeholder inside a percentage
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if(type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //REPLACE THE PLACEHOLDER TEXT WITH SOME ACTUAL DATA
            //replacing the placeholder %id% //to an id of the constructor
                newHtml = html.replace('%id%', obj.id) 
                newHtml = newHtml.replace('%description%', obj.description);
                newHtml = newHtml.replace('%value%', obj.value);

            //INSERT HTML INTO THE DOM
                document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);



        },

        deleteListItem: function(selectorID){

            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },

        clearFields: function(){
            var fields, fieldsArr;

            //outputs a list of queryselectorAll
            fields = document.querySelectorAll(DOMstrings.inputDesc + ', ' + DOMstrings.inputVal);

            //converts them into an array using slice
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";

            });

            fieldsArr[0].focus();

        },

        displayBudget:function(obj){

            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;

            if(obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

        },

        displayPercentages: function(percentages){

            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            

        },
        
        getDOMstrings: function(){
            return DOMstrings;
        }


    }
    
    
    
})();




// FOR THE 2 INDEPENDENT FUNCTIONS TO INTERACT ACCEPTS THE 2 FUNCTIONS AS AN ARGUMENT 
var AppController = (function(budgetCtrl, UICtrl){
    
    var setupEventListeners = function(){
        
        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    
        document.addEventListener('keypress',function(){
        
        if (event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        }
    });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    
    };

    var updateBudget = function() {

        //1 calculate the budget
        budgetCtrl.calculateBudget();

        //2 return the budget
        var budget = budgetCtrl.getBudget();

        //3 display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function(){

        //1 calculate the percentages
        budgetCtrl.calculatePercentages();

        //2 read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();

        //3 update the UI with the new percentage


    }
    
    
    var ctrlAddItem = function(){
        var input, newItem;
        
        //1 get the filled input data
        input = UICtrl.getInput();
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0) { 
            
            //2 add the item to the budget controller
            //adds the item to the data structure thats coming from the function addItem //on the budgetCtrl
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            
            //3 add item to the UI
            UICtrl.addListItem(newItem, input.type);
    
            //CLEARING FIELDS
            UICtrl.clearFields();
    
            //4 CALCULATE AND UPDATE BUDGET
            updateBudget();

        }else{
            alert('please input fields');
        }
        
    };

    var ctrlDeleteItem = function(event){

        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID) {

            //ID format = inc-1
            //outputs an array of the ID = ['inc','1']

            splitID = itemID.split('-');
            type = splitID[0]; //either inc or exp === inc-1/exp-1
            ID = parseInt(splitID[1]);

            //1  delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            //2 delete the item from the UI
            UICtrl.deleteListItem(itemID);

            //3 update and show the new totals/budget
            updateBudget();

        }

    };
    
    return{
        init: function(){
            console.log('the app started')
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };
    
    
    
    
    
})(BudgetController, UIController);

AppController.init();