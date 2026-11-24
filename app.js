// Dados dos Kits da Loja (Com preços promocionais de lançamento)
const products = [
    {
        id: 1,
        name: "Kit Mini (Degustação)",
        quantity: 6,
        price: 19.90,
        unitPrice: "R$ 3,31 / un.",
        badge: "Ideal P/ Presentes",
        description: "Ideal para presentes rápidos e lembrancinhas carinhosas."
    },
    {
        id: 2,
        name: "Kit Popular",
        quantity: 12,
        price: 34.90,
        unitPrice: "R$ 2,90 / un.",
        badge: "Mais Vendido 🔥",
        popular: true,
        description: "Destaque da loja! Perfeito para guardar momentos especiais."
    },
    {
        id: 3,
        name: "Kit Família / Viagem",
        quantity: 18,
        price: 47.90,
        unitPrice: "R$ 2,66 / un.",
        badge: "Super Recomendado",
        description: "Perfeito para colecionar fotos do ano todo na geladeira."
    },
    {
        id: 4,
        name: "Kit Mega / Fim de Ano",
        quantity: 24,
        price: 59.90,
        unitPrice: "R$ 2,49 / un.",
        badge: "Maior Desconto ✨",
        description: "Maior desconto unitário. Ótimo para dar de presente!"
    }
];

let cart = [];
let activeProductForUpload = null;
let selectedPhotos = [];
let selectedShippingCost = 0;
let selectedPaymentMethod = 'pix';

// Renderizar Produtos no Catálogo
function renderProducts() {
    const container = document.getElementById('products-grid');
    if (!container) return;

    container.innerHTML = products.map(p => `
        <div class="bg-white rounded-3xl p-5 border ${p.popular ? 'border-purple-400 ring-2 ring-purple-300' : 'border-purple-100'} shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative">
            ${p.badge ? `<span class="absolute -top-3 left-1/2 -translate-x-1/2 ${p.popular ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'} text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">${p.badge}</span>` : ''}
            
            <div class="space-y-4 pt-2">
                <div class="text-center space-y-1">
                    <h3 class="font-bold text-lg text-purple-950">${p.name}</h3>
                    <div class="inline-block bg-purple-50 text-purple-700 font-bold text-xs px-2.5 py-1 rounded-full">
                        ${p.quantity} Ímãs de Fotos
                    </div>
                </div>

                <p class="text-xs text-gray-500 text-center leading-relaxed">${p.description}</p>

                <div class="bg-purple-50/50 p-3 rounded-2xl text-center space-y-0.5">
                    <div class="text-2xl font-extrabold text-purple-700">R$ ${p.price.toFixed(2).replace('.', ',')}</div>
                    <div class="text-[11px] text-gray-500 font-medium">${p.unitPrice}</div>
                </div>
            </div>

            <button onclick="openUploadModal(${p.id})" class="mt-5 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2">
                <i class="fa-solid fa-cloud-arrow-up text-sm"></i> Anexar Fotos e Personalizar
            </button>
        </div>
    `).join('');
}

// Abrir Modal de Upload de Fotos
function openUploadModal(productId) {
    activeProductForUpload = products.find(p => p.id === productId);
    selectedPhotos = new Array(activeProductForUpload.quantity).fill(null).map(() => ({ file: null, preview: null, caption: '' }));

    document.getElementById('modal-kit-title').innerText = activeProductForUpload.name;
    document.getElementById('modal-kit-subtitle').innerText = `Anexe exatamente ${activeProductForUpload.quantity} fotos para este kit`;
    document.getElementById('required-count').innerText = activeProductForUpload.quantity;

    renderPhotoSlots();
    updateUploadStatus();
    document.getElementById('customize-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('customize-modal').classList.add('hidden');
}

// Renderizar Slots de Fotos
function renderPhotoSlots() {
    const container = document.getElementById('photos-upload-container');
    container.innerHTML = selectedPhotos.map((item, index) => `
        <div class="border border-purple-200 rounded-2xl p-3 bg-purple-50/30 flex gap-3 items-center">
            <div class="w-16 h-16 bg-white rounded-xl border border-purple-200 overflow-hidden flex items-center justify-center relative flex-shrink-0">
                ${item.preview 
                    ? `<img src="${item.preview}" class="w-full h-full object-cover">` 
                    : `<i class="fa-solid fa-image text-purple-300 text-xl"></i>`
                }
            </div>
            <div class="flex-1 space-y-1.5 min-w-0">
                <div class="flex justify-between items-center">
                    <span class="text-[11px] font-bold text-purple-900">Foto #${index + 1}</span>
                    ${item.preview ? `<button onclick="removePhoto(${index})" class="text-[10px] text-red-500 hover:underline">Remover</button>` : ''}
                </div>
                <input type="file" accept="image/*" onchange="handleFileSelect(event, ${index})" class="text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-purple-100 file:text-purple-700">
                <input type="text" placeholder="Legenda/Frase (opcional)" value="${item.caption}" onchange="updateCaption(${index}, this.value)" class="w-full text-[10px] p-1.5 border border-purple-200 rounded-lg outline-none">
            </div>
        </div>
    `).join('');
}

function handleFileSelect(event, index) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            selectedPhotos[index].file = file;
            selectedPhotos[index].preview = e.target.result;
            renderPhotoSlots();
            updateUploadStatus();
        };
        reader.readAsDataURL(file);
    }
}

function updateCaption(index, value) {
    selectedPhotos[index].caption = value;
}

function removePhoto(index) {
    selectedPhotos[index] = { file: null, preview: null, caption: '' };
    renderPhotoSlots();
    updateUploadStatus();
}

function updateUploadStatus() {
    const filledCount = selectedPhotos.filter(p => p.preview !== null).length;
    document.getElementById('uploaded-count').innerText = filledCount;
    const btn = document.getElementById('btn-confirm-photos');
    
    if (filledCount === activeProductForUpload.quantity) {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
    }
}

function confirmAndAddToCart() {
    cart.push({
        product: activeProductForUpload,
        photos: [...selectedPhotos]
    });
    closeModal();
    updateCartUI();
    toggleCart();
}

// Lógica do Carrinho
function toggleCart() {
    const panel = document.getElementById('cart-panel');
    const backdrop = document.getElementById('cart-backdrop');
    const drawer = document.getElementById('cart-drawer');

    const isOpen = !panel.classList.contains('translate-x-full');
    if (isOpen) {
        panel.classList.add('translate-x-full');
        backdrop.classList.add('opacity-0');
        setTimeout(() => drawer.classList.add('pointer-events-none'), 300);
    } else {
        drawer.classList.remove('pointer-events-none');
        panel.classList.remove('translate-x-full');
        backdrop.classList.remove('opacity-0');
    }
}

function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    badge.innerText = cart.length;
    badge.classList.toggle('hidden', cart.length === 0);

    const container = document.getElementById('cart-items');
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-10 text-gray-400 space-y-2">
                <i class="fa-solid fa-basket-shopping text-4xl text-purple-200"></i>
                <p class="text-xs font-medium">Seu carrinho está vazio.</p>
            </div>
        `;
    } else {
        container.innerHTML = cart.map((item, index) => `
            <div class="p-3 border border-purple-100 bg-purple-50/40 rounded-2xl flex items-center justify-between gap-3">
                <div class="space-y-1 flex-1">
                    <h4 class="font-bold text-xs text-purple-950">${item.product.name}</h4>
                    <p class="text-[10px] text-purple-600 font-semibold">${item.photos.length} fotos anexadas</p>
                    <span class="text-xs font-extrabold text-purple-700 block">R$ ${item.product.price.toFixed(2).replace('.', ',')}</span>
                </div>
                <button onclick="removeFromCart(${index})" class="text-gray-400 hover:text-red-500 p-2 text-sm">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    calculateTotals();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function calculateShipping() {
    const cep = document.getElementById('cep-input').value;
    if (cep.length < 8) {
        alert('Digite um CEP válido.');
        return;
    }
    
    const optionsDiv = document.getElementById('shipping-options');
    optionsDiv.classList.remove('hidden');
    optionsDiv.innerHTML = `
        <div class="space-y-1.5 text-xs">
            <label class="flex items-center justify-between p-2 border border-purple-200 rounded-xl bg-white cursor-pointer hover:bg-purple-50">
                <div class="flex items-center gap-2">
                    <input type="radio" name="shipping" value="14.90" checked onchange="updateShippingCost(14.90)">
                    <span>PAC (Econômico)</span>
                </div>
                <span class="font-bold text-purple-700">R$ 14,90</span>
            </label>
            <label class="flex items-center justify-between p-2 border border-purple-200 rounded-xl bg-white cursor-pointer hover:bg-purple-50">
                <div class="flex items-center gap-2">
                    <input type="radio" name="shipping" value="24.90" onchange="updateShippingCost(24.90)">
                    <span>SEDEX (Expresso)</span>
                </div>
                <span class="font-bold text-purple-700">R$ 24,90</span>
            </label>
        </div>
    `;
    updateShippingCost(14.90);
}

function updateShippingCost(cost) {
    selectedShippingCost = cost;
    calculateTotals();
}

function calculateTotals() {
    const subtotal = cart.reduce((acc, item) => acc + item.product.price, 0);
    const total = subtotal + selectedShippingCost;

    document.getElementById('cart-subtotal').innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('cart-shipping').innerText = `R$ ${selectedShippingCost.toFixed(2).replace('.', ',')}`;
    document.getElementById('cart-total').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;

    const btnCheckout = document.getElementById('btn-checkout');
    if (cart.length > 0) {
        btnCheckout.disabled = false;
        btnCheckout.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        btnCheckout.disabled = true;
        btnCheckout.classList.add('opacity-50', 'cursor-not-allowed');
    }
}

// Checkout & Pagamentos
function openCheckout() {
    toggleCart();
    document.getElementById('checkout-modal').classList.remove('hidden');
    updateCheckoutTotals();
}

function closeCheckout() {
    document.getElementById('checkout-modal').classList.add('hidden');
}

function selectPayment(method) {
    selectedPaymentMethod = method;
    ['pix', 'card', 'boleto'].forEach(m => {
        document.getElementById(`pay-content-${m}`).classList.toggle('hidden', m !== method);
        const btn = document.getElementById(`pay-btn-${m}`);
        if (m === method) {
            btn.classList.add('border-2', 'border-purple-600', 'bg-purple-50');
            btn.classList.remove('border-gray-200');
        } else {
            btn.classList.remove('border-2', 'border-purple-600', 'bg-purple-50');
            btn.classList.add('border-gray-200');
        }
    });
    updateCheckoutTotals();
}

function updateCheckoutTotals() {
    let subtotal = cart.reduce((acc, item) => acc + item.product.price, 0);
    let total = subtotal + selectedShippingCost;

    if (selectedPaymentMethod === 'pix') {
        total = total * 0.95; // 5% OFF
    }

    document.getElementById('checkout-final-total').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;

    const cardSelect = document.getElementById('card-installments');
    if (cardSelect) {
        cardSelect.innerHTML = [1,2,3,4,5,6].map(i => `
            <option value="${i}">${i}x de R$ ${(total/i).toFixed(2).replace('.', ',')} sem juros</option>
        `).join('');
    }
}

function finishOrder() {
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const address = document.getElementById('cust-address').value.trim();
    const city = document.getElementById('cust-city').value.trim();
    const cep = document.getElementById('cust-cep-checkout').value.trim();

    if (!name || !phone || !address || !city) {
        alert('Por favor, preencha os campos obrigatórios de entrega (Nome, WhatsApp, Endereço e Cidade)!');
        return;
    }

    let subtotal = cart.reduce((acc, item) => acc + item.product.price, 0);
    let total = subtotal + selectedShippingCost;
    if (selectedPaymentMethod === 'pix') {
        total = total * 0.95;
    }

    let mensagem = `✨ *NOVO PEDIDO - ÍMÃS & AFETO* ✨\n\n`;

    mensagem += `👤 *DADOS DO CLIENTE*\n`;
    mensagem += `• *Nome:* ${name}\n`;
    mensagem += `• *WhatsApp:* ${phone}\n`;
    mensagem += `• *Endereço:* ${address}\n`;
    mensagem += `${city} (CEP: ${cep || 'Não informado'})\n\n`;

    mensagem += `🛒 *ITENS DO PEDIDO*\n`;

    cart.forEach((cartItem, itemIndex) => {
        mensagem += `\n*${itemIndex + 1}. ${cartItem.product.name}* (R$ ${cartItem.product.price.toFixed(2).replace('.', ',')})\n`;

        cartItem.photos.forEach((p, photoIndex) => {
            const legenda = p.caption && p.caption.trim() !== "" ? `"${p.caption.trim()}"` : "(Sem legenda)";
            mensagem += `   - Foto #${photoIndex + 1}: ${legenda}\n`;
        });
    });

    mensagem += `\n-----------------------------------\n`;
    mensagem += `🚚 *Frete:* R$ ${selectedShippingCost.toFixed(2).replace('.', ',')}\n`;
    mensagem += `💳 *Forma de Pagamento:* ${selectedPaymentMethod.toUpperCase()} ${selectedPaymentMethod === 'pix' ? '(Com 5% OFF)' : ''}\n`;
    mensagem += `💰 *VALOR TOTAL:* *R$ ${total.toFixed(2).replace('.', ',')}*\n`;
    mensagem += `-----------------------------------\n\n`;
    mensagem += `📸 *PRÓXIMO PASSO:* Olá! Seguem acima os detalhes do meu pedido e as legendas. Vou enviar as fotos correspondentes aqui na conversa agora mesmo!`;

    // ⚠️ SUBSTITUA ABAIXO PELO SEU NÚMERO DE WHATSAPP COM O CÓDIGO DO PAÍS E DDD (ex: 5511999999999)
    const numeroWhatsApp = "5511999999999"; 

    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

    closeCheckout();
    cart = [];
    updateCartUI();

    window.open(urlWhatsApp, '_blank');
}

// Inicializar na abertura da página
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});