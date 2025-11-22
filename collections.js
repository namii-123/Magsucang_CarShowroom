
var CarCollection = Backbone.Collection.extend({
    model: Car,
    
    initialize: function() {
        this.on('add remove change', this.saveToStorage, this);
        this.loadFromStorage();
    },
    
    saveToStorage: function() {
        StorageManager.save('cars', this.toJSON());
    },
    
    loadFromStorage: function() {
        var data = StorageManager.load('cars');
        if (data && data.length > 0) {
            this.reset(data);
            console.log("Loaded", data.length, "cars from localStorage");
        } else {
           
            this.reset([
                { id: 1, brand: 'Toyota', model: 'Vios', price: 850000, year: 2023, transmission: 'Automatic', fuel: 'Gasoline', mileage: 0, condition: 'Brand New', color: 'White', stock: 'Available', description: 'Brand new Toyota Vios', image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400' },
                { id: 2, brand: 'Honda', model: 'Civic', price: 1450000, year: 2023, transmission: 'CVT', fuel: 'Gasoline', mileage: 0, condition: 'Brand New', color: 'Black', stock: 'Available', description: 'Sporty Honda Civic', image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400' },
                { id: 3, brand: 'Mitsubishi', model: 'Montero Sport', price: 1850000, year: 2023, transmission: 'Automatic', fuel: 'Diesel', mileage: 0, condition: 'Brand New', color: 'Red', stock: 'Available', description: 'Family SUV', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400' }
            ]);
            console.log("No saved cars → Loaded 3 sample cars");
        }
    }
});

var ClientCollection = Backbone.Collection.extend({ model: Client,
    initialize: function() { this.on('add remove change', this.saveToStorage, this); this.loadFromStorage(); },
    saveToStorage: function() { StorageManager.save('clients', this.toJSON()); },
    loadFromStorage: function() { var d = StorageManager.load('clients'); if (d) this.reset(d); }
});

var CartCollection = Backbone.Collection.extend({ model: CartItem,
    getTotal: function() {
        return this.reduce(function(sum, item) {
            var car = item.get('car');
            return sum + (car ? car.get('price') : 0);
        }, 0);
    }
});

var SaleCollection = Backbone.Collection.extend({ model: Sale,
    initialize: function() { this.on('add remove', this.saveToStorage, this); this.loadFromStorage(); },
    saveToStorage: function() { StorageManager.save('sales', this.toJSON()); },
    loadFromStorage: function() { var d = StorageManager.load('sales'); if (d) this.reset(d); }
});


var cars    = new CarCollection();
var clients = new ClientCollection();
var cart    = new CartCollection();
var sales   = new SaleCollection();