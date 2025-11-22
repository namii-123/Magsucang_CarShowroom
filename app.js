

$(document).ready(function() {
    console.log("AutoDealer Pro Loaded!");

    
    function handleImageUpload(fileInput, callback) {
        var file = fileInput[0].files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = e => callback(e.target.result);
            reader.readAsDataURL(file);
        }
    }
    function showImagePreview(url, el) {
        if(url) el.html(`<img src="${url}" style="max-width:100%;border-radius:12px;">`);
        else el.empty();
    }



    
        const ClientView = Backbone.View.extend({
            tagName: 'div',
            className: 'client-card',
            template: _.template(`
                <div class="client-actions">
                    <button class="btn btn-edit edit-client">Edit</button>
                    <button class="btn btn-danger delete-client">Delete</button>
                </div>
                <div class="client-name"><%= name %> <%= carNumber ? '• ' + carNumber : '' %></div>
                <div class="client-details">
                    Card Number: <strong><%= carNumber || 'N/A' %></strong><br>
                    Email: <%= email %><br>
                    Phone: <%= phone %><br>
                    License: <%= license %><br>
                    Address: <%= address %>
                </div>
            `),
            events: {
                'click .delete-client': 'delete',
                'click .edit-client': 'edit'
            },
            render: function() {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            },
            delete: function() {
                if (confirm('Delete this client permanently?')) {
                    this.model.collection.remove(this.model);
                    this.remove();
                }
            },
            edit: function() {
                $('#editClientId').val(this.model.id || this.model.cid);
                $('#editClientName').val(this.model.get('name'));
                $('#editClientCarNumber').val(this.model.get('carNumber'));
                $('#editClientEmail').val(this.model.get('email'));
                $('#editClientPhone').val(this.model.get('phone'));
                $('#editClientLicense').val(this.model.get('license'));
                $('#editClientAddress').val(this.model.get('address'));
                $('#updateClientForm').slideDown();
                $('html, body').animate({scrollTop: $('#updateClientForm').offset().top - 100}, 500);
            }
        });

       
        function renderClients() {
            $('#clientList').empty();
            if (clients.length === 0) {
                $('#clientList').html('<div class="empty-state"><div class="empty-state-icon">No clients</div><div class="empty-state-text">No clients registered yet.</div></div>');
            } else {
                clients.each(client => {
                    const view = new ClientView({model: client});
                    $('#clientList').append(view.render().el);
                });
            }
        }

      
        $('#addClientForm').on('submit', function(e) {
            e.preventDefault();
            const newClient = new Client({
                id: Date.now(),
                name: $('#clientName').val(),
                carNumber: $('#clientCarNumber').val().toUpperCase(),
                email: $('#clientEmail').val(),
                phone: $('#clientPhone').val(),
                license: $('#clientLicense').val(),
                address: $('#clientAddress').val()
            });
            clients.add(newClient);
            this.reset();
            renderClients();
            alert('Client registered successfully!');
        });

        
        $('#editClientForm').on('submit', function(e) {
            e.preventDefault();
            const id = $('#editClientId').val();
            const client = clients.get(id);
            if (client) {
                client.set({
                    name: $('#editClientName').val(),
                    carNumber: $('#editClientCarNumber').val().toUpperCase(),
                    email: $('#editClientEmail').val(),
                    phone: $('#editClientPhone').val(),
                    license: $('#editClientLicense').val(),
                    address: $('#editClientAddress').val()
                });
                renderClients();
                $('#updateClientForm').slideUp();
                alert('Client updated!');
            }
        });

        $('#cancelEditClient').on('click', () => $('#updateClientForm').slideUp());

        $('.tab-btn').on('click', function() {
            $('.tab-btn').removeClass('active');
            $(this).addClass('active');
            $('.tab-content').removeClass('active');
            $('#' + $(this).data('tab')).addClass('active');

            if ($(this).data('tab') === 'clients') renderClients();
        });

    
    var CarView = Backbone.View.extend({
        tagName: 'div',
        className: 'car-card',
        template: _.template(`
            <div class="car-condition <%= condition === 'Brand New' ? 'new' : 'used' %>"><%= condition %></div>
            <img src="<%= image %>" class="car-image" alt="<%= brand %> <%= model %>">
            <div class="car-info">
                <div class="car-brand"><%= brand %></div>
                <div class="car-name"><%= model %> (<%= year %>)</div>
                <div class="car-specs">
                    <div class="car-spec">Gear <%= transmission %></div>
                    <div class="car-spec">Fuel <%= fuel %></div>
                    <div class="car-spec">Mileage <%= mileage.toLocaleString() %> km</div>
                    <div class="car-spec">Color <%= color %></div>
                </div>
                <div style="font-size:13px;color:<%= stock==='Available'?'#11998e':(stock==='Sold'?'#ff6b6b':'#f5a623') %>;font-weight:700;margin:10px 0;">
                    <%= stock === 'Available' ? 'Available' : (stock === 'Sold' ? 'Sold' : 'Reserved') %>
                </div>
                <div class="car-price">₱<%= price.toLocaleString() %></div>
                <div class="car-actions">
                    <button class="btn btn-edit edit-btn">Edit</button>
                    <button class="btn btn-danger delete-btn">Delete</button>
                </div>
            </div>
        `),
        events: {
            'click .edit-btn': 'editCar',
            'click .delete-btn': 'deleteCar'
        },
        editCar: function() {
            var m = this.model;
            $('#updateCarId').val(m.id || m.cid);
            $('#updateCarBrand').val(m.get('brand'));
            $('#updateCarModel').val(m.get('model'));
            $('#updateCarPrice').val(m.get('price'));
            $('#updateCarYear').val(m.get('year'));
            $('#updateCarTransmission').val(m.get('transmission'));
            $('#updateCarFuel').val(m.get('fuel'));
            $('#updateCarMileage').val(m.get('mileage'));
            $('#updateCarCondition').val(m.get('condition'));
            $('#updateCarColor').val(m.get('color'));
            $('#updateCarStock').val(m.get('stock'));
            $('#updateCarDescription').val(m.get('description'));
            $('#updateCarImageUrl').val('');
            $('#updateCarImageFile').val('');
            showImagePreview(m.get('image'), $('#updateImagePreview'));
            $('#updateCarForm').slideDown();
            $('html,body').animate({scrollTop: $('#updateCarForm').offset().top - 50}, 500);
        },
        deleteCar: function() {
            if (confirm('Sure ka delete ni nga car?')) {
                this.model.collection.remove(this.model);
                this.remove();
                renderShowroom();
                updateStats();
            }
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    var ShowroomCarView = Backbone.View.extend({
        tagName: 'div',
        className: 'showroom-car',
        template: _.template(`
            <img src="<%= image %>" alt="<%= brand %> <%= model %>">
            <div class="showroom-car-info">
                <div class="showroom-car-brand"><%= brand %></div>
                <div class="showroom-car-name"><%= model %> (<%= year %>)</div>
                <div class="showroom-car-specs">
                    <span class="showroom-car-spec">Gear <%= transmission %></span>
                    <span class="showroom-car-spec">Fuel <%= fuel %></span>
                    <span class="showroom-car-spec">Mileage <%= mileage.toLocaleString() %> km</span>
                    <span class="showroom-car-spec">Color <%= color %></span>
                </div>
                <div style="margin-top:10px;font-size:14px;color:#666;"><%= description %></div>
            </div>
            <div>
                <div class="showroom-car-price">₱<%= price.toLocaleString() %></div>
                <% if (stock === 'Available') { %>
                    <button class="btn btn-primary add-to-cart">Add to Cart</button>
                <% } else { %>
                    <button class="btn" disabled style="background:#ccc;"><%= stock==='Sold'?'Sold Out':'Reserved' %></button>
                <% } %>
            </div>
        `),
        events: { 'click .add-to-cart': 'addToCart' },
        addToCart: function() {
            if (cart.length > 0) {
                alert("One car per purchase lang bro! Clear the cart first.");
                return;
            }
            cart.add({ car: this.model });
            alert("Added to cart: " + this.model.get('brand') + " " + this.model.get('model'));
            updateCart();
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            if (this.model.get('stock') !== 'Available') this.$el.addClass('unavailable');
            else this.$el.removeClass('unavailable');
            return this;
        }
    });

   

    var SaleView = Backbone.View.extend({
        tagName: 'div', className: 'order-card',
        template: _.template(`
            <div class="order-header">
                <div><div class="order-id">Sale #<%= saleNumber %></div>
                    <div style="color:#666;margin-top:8px;">Person <%= client.name %><br>Email: <%= client.email %></div>
                </div>
                <div class="order-date"><%= date %></div>
            </div>
            <div class="order-items">
                <div class="order-item">
                    <strong style="color:#1e3c72;"><%= car.brand %> <%= car.model %> (<%= car.year %>)</strong><br>
                    <small><%= car.transmission %> • <%= car.fuel %> • <%= car.color %></small>
                </div>
            </div>
            <div class="order-total">Total: ₱<%= total.toLocaleString() %></div>
        `),
        render: function() { this.$el.html(this.template(this.model.toJSON())); return this; }
    });

    
    function renderCars() {
        $('#carList').empty();
        if (cars.length === 0) {
            $('#carList').html('<div class="empty-state"><div class="empty-state-icon">Car</div><div class="empty-state-text">No cars yet!</div></div>');
        } else {
            cars.each(function(car) {
                var view = new CarView({model: car});
                $('#carList').append(view.render().el);
            });
        }
    }

    function renderShowroom() {
        $('#showroomCars').empty();
        cars.each(function(car) {
            var view = new ShowroomCarView({model: car});
            $('#showroomCars').append(view.render().el);
        });
    }

    function renderClients() {
        $('#clientList').empty();
        clients.each(function(c) {
            var view = new ClientView({model: c});
            $('#clientList').append(view.render().el);
        });
    }

    function renderSales() {
        $('#salesList').empty();
        sales.each(function(s) {
            var view = new SaleView({model: s});
            $('#salesList').append(view.render().el);
        });
    }




    function updateCart() {
        var html = '';
        if (cart.length === 0) {
            html = '<div class="empty-state" style="color:white;"><div class="empty-state-icon">Cart</div><div class="empty-state-text">Cart is empty</div></div>';
        } else {
            cart.each(function(item) {
                var car = item.get('car');
                html += `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${car.get('brand')} ${car.get('model')} (${car.get('year')})</div>
                            <div style="font-size:13px;opacity:0.9;">${car.get('transmission')} • ${car.get('fuel')} • ${car.get('color')}</div>
                        </div>
                        <div style="font-weight:700;">₱${car.get('price').toLocaleString()}</div>
                        <button class="btn btn-danger" data-cid="${item.cid}" style="padding:8px 12px;">Remove</button>
                    </div>`;
            });
        }
        $('#cartItems').html(html);
        $('#cartTotal').text(cart.getTotal().toLocaleString());
    }

    function updateStats() {
        $('#totalCars').text(cars.length);
        $('#totalSales').text(sales.length);
        var revenue = sales.reduce((sum, s) => sum + s.get('total'), 0);
        $('#totalRevenue').text('₱' + revenue.toLocaleString());
    }

    
    $('.tab-btn').on('click', function() {
        var tab = $(this).data('tab');
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');
        $('.tab-content').removeClass('active');
        $('#' + tab).addClass('active');

        if (tab === 'showroom') renderShowroom();
        if (tab === 'clients') renderClients();
        if (tab === 'sales') renderSales();
    });

    
    $('#carImageFile').on('change', function() { handleImageUpload($(this), img => { $('#carImageUrl').val(''); showImagePreview(img, $('#addImagePreview')); }); });
    $('#carImageUrl').on('input', function() { if ($(this).val()) { $('#carImageFile').val(''); showImagePreview($(this).val(), $('#addImagePreview')); } });
    $('#updateCarImageFile').on('change', function() { handleImageUpload($(this), img => { $('#updateCarImageUrl').val(''); showImagePreview(img, $('#updateImagePreview')); }); });
    $('#updateCarImageUrl').on('input', function() { if ($(this).val()) showImagePreview($(this).val(), $('#updateImagePreview')); });


    $('#addCarForm').on('submit', function(e) {
        e.preventDefault();
        var url = $('#carImageUrl').val() || 'https://via.placeholder.com/400x300?text=No+Image';
        if ($('#carImageFile')[0].files.length > 0) {
            handleImageUpload($('#carImageFile'), data => createCar(data));
        } else {
            createCar(url);
        }
    });

    function createCar(img) {
        cars.add(new Car({
            id: Date.now(),
            brand: $('#carBrand').val(),
            model: $('#carModel').val(),
            price: +$('#carPrice').val(),
            year: +$('#carYear').val(),
            transmission: $('#carTransmission').val(),
            fuel: $('#carFuel').val(),
            mileage: +$('#carMileage').val(),
            condition: $('#carCondition').val(),
            color: $('#carColor').val(),
            stock: $('#carStock').val(),
            description: $('#carDescription').val(),
            image: img
        }));
        $('#addCarForm')[0].reset();
        $('#addImagePreview').empty();
        alert("Car added!");
    }

    
    $('#updateForm').on('submit', function(e) {
        e.preventDefault();
        var car = cars.get($('#updateCarId').val());
        if (!car) return;

        var img = car.get('image');
        if ($('#updateCarImageFile')[0].files.length > 0) {
            handleImageUpload($('#updateCarImageFile'), data => updateCar(car, data));
        } else if ($('#updateCarImageUrl').val()) {
            updateCar(car, $('#updateCarImageUrl').val());
        } else {
            updateCar(car, img);
        }
    });

    function updateCar(car, img) {
        car.set({
            brand: $('#updateCarBrand').val(),
            model: $('#updateCarModel').val(),
            price: +$('#updateCarPrice').val(),
            year: +$('#updateCarYear').val(),
            transmission: $('#updateCarTransmission').val(),
            fuel: $('#updateCarFuel').val(),
            mileage: +$('#updateCarMileage').val(),
            condition: $('#updateCarCondition').val(),
            color: $('#updateCarColor').val(),
            stock: $('#updateCarStock').val(),
            description: $('#updateCarDescription').val(),
            image: img
        });
        $('#updateCarForm').slideUp();
        alert("Car updated!");
    }

    $('#cancelUpdate').on('click', () => $('#updateCarForm').slideUp());

    
    $('#addClientForm').on('submit', function(e) {
        e.preventDefault();
        clients.add(new Client({
            id: Date.now(),
            name: $('#clientName').val(),
            email: $('#clientEmail').val(),
            phone: $('#clientPhone').val(),
            license: $('#clientLicense').val(),
            address: $('#clientAddress').val()
        }));
        this.reset();
        alert("Client registered!");
    });

    
    $(document).on('click', '[data-cid]', function() {
        var item = cart.get($(this).data('cid'));
        if (item) cart.remove(item);
        updateCart();
    });

    
    $('#checkoutBtn').on('click', function() {
        if (cart.length === 0) return alert("Cart is empty!");
        if (clients.length === 0) return alert("Register a client first!"), $('.tab-btn[data-tab="clients"]').click();

        var carModel = cart.at(0).get('car');
        if (carModel.get('stock') !== 'Available') return alert("Car no longer available!"), cart.reset(), updateCart();

        var sale = new Sale({
            saleNumber: 'SALE' + Date.now().toString().slice(-8),
            client: clients.at(0).toJSON(),
            car: carModel.toJSON(),
            total: cart.getTotal(),
            date: new Date().toLocaleString()
        });
        sales.add(sale);
        carModel.set('stock', 'Sold');
        cart.reset();
        updateCart();
        updateStats();
        alert("SOLD! Sale #" + sale.get('saleNumber') + "\nTotal: ₱" + sale.get('total').toLocaleString());
    });

    
    cars.on('add remove change reset', () => { renderCars(); renderShowroom(); updateStats(); });
    clients.on('add remove change reset', renderClients);
    sales.on('add remove change reset', renderSales);
    cart.on('add remove reset', updateCart);

    
    renderCars();
    renderShowroom();
    renderClients();
    renderSales();
    updateCart();
    updateStats();
});


$(document).ready(function() {
    
    function renderClients() {
        $('#clientList').empty();
        if (clients.length === 0) {
            $('#clientList').html('<div class="empty-state"><div class="empty-state-icon">No clients</div><div>No registered clients yet.</div></div>');
        } else {
            clients.each(client => {
                const view = new ClientItemView({model: client});
                $('#clientList').append(view.render().el);
            });
        }
    }

    function renderCars() {
        $('#carList').empty();
        cars.each(car => {
            const view = new CarItemView({model: car});
            $('#carList').append(view.render().el);
        });
    }

    
    renderClients();
    renderCars();
});