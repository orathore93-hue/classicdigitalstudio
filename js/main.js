(function () {
    'use strict';

    // --- Elements ---
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const imageModal = $('#imageModal');
    const modalImage = $('#modalImage');
    const orderModal = $('#orderModal');
    const introLayer = $('#intro-layer');

    // --- Store Status ---
    function updateStoreStatus() {
        const now = new Date();
        const day = now.getDay();
        const hours = now.getHours();
        const dot = $('#statusDot');
        const text = $('#statusText');

        if (day === 0) {
            dot.className = 'w-2 h-2 rounded-full bg-red-500';
            text.textContent = 'Closed \u2022 Sunday';
        } else if (hours >= 9 && hours < 23) {
            dot.className = 'w-2 h-2 rounded-full bg-green-500 animate-pulse';
            text.textContent = 'Open Now \u2022 Closes 11.30 PM';
        } else {
            dot.className = 'w-2 h-2 rounded-full bg-red-500';
            text.textContent = 'Closed \u2022 Opens 9 AM';
        }
    }

    // --- Intro ---
    let introFinished = false;

    function finishIntro() {
        if (introFinished) return;
        introFinished = true;
        document.body.classList.add('intro-finished');
        setTimeout(() => {
            document.body.classList.remove('intro-active');
            document.body.style.overflowX = 'hidden';
            document.body.style.overflowY = 'auto';
        }, 800);
    }

    window.addEventListener('load', () => setTimeout(finishIntro, 2500));
    introLayer.addEventListener('click', finishIntro);

    // --- Modal Helpers ---
    function setBodyScroll(locked) {
        document.body.style.overflow = locked ? 'hidden' : 'auto';
    }

    function trapFocus(modal) {
        const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        first.focus();

        modal._trapHandler = (e) => {
            if (e.key !== 'Tab') return;
            if (e.shiftKey) {
                if (document.activeElement === first) { e.preventDefault(); last.focus(); }
            } else {
                if (document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        };
        modal.addEventListener('keydown', modal._trapHandler);
    }

    function releaseFocus(modal) {
        if (modal._trapHandler) {
            modal.removeEventListener('keydown', modal._trapHandler);
            delete modal._trapHandler;
        }
    }

    // --- Image Modal ---
    function openImageModal(src) {
        modalImage.src = src;
        imageModal.classList.remove('hidden');
        setBodyScroll(true);
        trapFocus(imageModal);
    }

    function closeImageModal() {
        imageModal.classList.add('hidden');
        setBodyScroll(false);
        releaseFocus(imageModal);
    }

    $('#closeImageModal').addEventListener('click', closeImageModal);
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) closeImageModal();
    });

    // Portfolio items — event delegation
    $$('.portfolio-item').forEach((item) => {
        item.addEventListener('click', () => openImageModal(item.dataset.image));
    });

    // --- Order Modal ---
    function openOrderModal() {
        orderModal.classList.remove('hidden');
        setBodyScroll(true);
        trapFocus(orderModal);
    }

    function closeOrderModal() {
        orderModal.classList.add('hidden');
        if (!document.body.classList.contains('intro-active')) setBodyScroll(false);
        releaseFocus(orderModal);
    }

    $('#orderBtn').addEventListener('click', openOrderModal);
    $$('.orderTrigger').forEach((el) => el.addEventListener('click', openOrderModal));
    $('#closeOrderBtn').addEventListener('click', closeOrderModal);
    orderModal.addEventListener('click', (e) => {
        if (e.target === orderModal) closeOrderModal();
    });

    // --- Mobile Menu ---
    $('#menuToggle').addEventListener('click', () => {
        $('#mobile-menu').classList.toggle('hidden');
    });

    // --- WhatsApp Form ---
    $('#whatsappForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = $('#custName').value.trim();
        const service = $('#serviceType').value;
        const details = $('#orderDetails').value.trim();
        const phone = '923006174014';

        const message = [
            '*NEW ORDER FROM WEBSITE*',
            '--------------------------',
            `*Name:* ${name}`,
            `*Service:* ${service}`,
            `*Details:* ${details}`
        ].join('\n');

        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        closeOrderModal();
    });

    // --- Keyboard ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!orderModal.classList.contains('hidden')) closeOrderModal();
            else if (!imageModal.classList.contains('hidden')) closeImageModal();
        }
    });

    // --- Init ---
    updateStoreStatus();
})();
