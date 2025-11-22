var CarCollection = Backbone.Collection.extend({
    model: Car,
    initialize: function() {
        this.on('add remove change reset', this.saveToStorage, this);
        this.loadFromStorage();
    },
    saveToStorage: function() { StorageManager.save('cars', this.toJSON()); },
    loadFromStorage: function() {
        const data = StorageManager.load('cars');
        if (data && data.length) this.reset(data);
        else this.reset([
            {id:1, brand:'Toyota', model:'Vios', price:850000, year:2023, stock:'Available', image:'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400'},
            {id:2, brand:'Honda', model:'Civic', price:1450000, year:2023, stock:'Available', image:'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400'}
        ]);
    }
});

var ClientCollection = Backbone.Collection.extend({
    model: Client,
    initialize: function() {
        this.on('add remove change reset', this.saveToStorage, this);
        this.loadFromStorage();
    },
    saveToStorage: function() { StorageManager.save('clients', this.toJSON()); },
    loadFromStorage: function() {
        const data = StorageManager.load('clients');
        if (data) this.reset(data);
    }
});

var CartCollection = Backbone.Collection.extend({
    model: CartItem,
    getTotal: function() {
        return this.reduce((sum, item) => sum + (item.get('car')?.get('price') || 0), 0);
    }
});

var SaleCollection = Backbone.Collection.extend({
    model: Sale,
    initialize: function() {
        this.on('add', this.saveToStorage, this);
        this.loadFromStorage();
    },
    saveToStorage: function() { StorageManager.save('sales', this.toJSON()); },
    loadFromStorage: function() {
        const data = StorageManager.load('sales');
        if (data) this.reset(data);
    }
});

const cars = new CarCollection();
const clients = new ClientCollection();
const cart = new CartCollection();
const sales = new SaleCollection();




var ClientItemView = Backbone.View.extend({
    tagName: 'div',
    className: 'client-card',
    template: _.template(`
        <div class="client-header">
            <div class="client-name"><strong><%= name %></strong></div>
            <div class="client-actions">
                <button class="btn btn-edit edit-client">Edit</button>
                <button class="btn btn-danger delete-client">Delete</button>
            </div>
        </div>
        <div class="client-details">
            Card Number: <strong><%= carNumber || 'N/A' %></strong><br>
            Email: <%= email %><br>
            Phone: <%= phone %><br>
            License: <%= license %><br>
            Address: <%= address %>
        </div>
    `),
    events: {
        'click .edit-client': 'editClient',
        'click .delete-client': 'deleteClient'
    },
    editClient: function() {
        const m = this.model;
        $('#editClientId').val(m.id || m.cid);
        $('#editClientName').val(m.get('name'));
        $('#editClientCarNumber').val(m.get('carNumber') || '');
        $('#editClientEmail').val(m.get('email'));
        $('#editClientPhone').val(m.get('phone'));
        $('#editClientLicense').val(m.get('license'));
        $('#editClientAddress').val(m.get('address'));
        $('#updateClientForm').slideDown();
    },
    deleteClient: function() {
        if (confirm('Sure ka i-delete ni nga client?')) {
            this.model.collection.remove(this.model);
            this.remove();
        }
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});