var StorageManager = {
    save: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
    load: (key) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
};

var Car = Backbone.Model.extend({
    defaults: {
        brand: '', model: '', price: 0, year: 2023,
        transmission: 'Automatic', fuel: 'Gasoline', mileage: 0,
        condition: 'Brand New', color: 'White', stock: 'Available',
        description: '', image: 'https://via.placeholder.com/400x300?text=No+Image'
    }
});

var Client = Backbone.Model.extend({
    defaults: {
        name: '', carNumber: '', email: '', phone: '', license: '', address: ''
    }
});

var CartItem = Backbone.Model.extend({});
var Sale = Backbone.Model.extend({
    defaults: { saleNumber: '', client: null, car: null, total: 0, date: '' }
});