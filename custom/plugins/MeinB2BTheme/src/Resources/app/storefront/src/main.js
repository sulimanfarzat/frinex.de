import Plugin from 'src/plugin-system/plugin.class';
import PluginManager from 'src/plugin-system/plugin.manager';

/**
 * QuickOrderPlugin
 *
 * Registered on the <form id="quick-order-form"> element.
 * Handles dynamic row management and client-side validation
 * for the B2B quick-order page.
 */
class QuickOrderPlugin extends Plugin {
    static options = {
        rowSelector: '.quick-order-row',
        skuSelector: '.quick-order-sku',
        qtySelector: '.quick-order-qty',
        addRowBtnId: 'quick-order-add-row',
        clearBtnId: 'quick-order-clear',
        tbodyId: 'quick-order-rows',
    };

    init() {
        this._tbody   = document.getElementById(this.options.tbodyId);
        this._addBtn  = document.getElementById(this.options.addRowBtnId);
        this._clearBtn = document.getElementById(this.options.clearBtnId);

        if (!this._tbody) return;

        this._registerEvents();
    }

    _registerEvents() {
        if (this._addBtn) {
            this._addBtn.addEventListener('click', this._onAddRow.bind(this));
        }

        if (this._clearBtn) {
            this._clearBtn.addEventListener('click', this._onClear.bind(this));
        }

        this._tbody.addEventListener('click', this._onRemoveRow.bind(this));
        this._tbody.addEventListener('click', this._onQtyButtonClick.bind(this));
        this._tbody.addEventListener('keydown', this._onTabLastRow.bind(this));

        this.el.addEventListener('submit', this._onSubmit.bind(this));
    }

    _getRows() {
        return Array.from(this._tbody.querySelectorAll(this.options.rowSelector));
    }

    _getNextIndex() {
        return this._getRows().length + 1;
    }

    _updateIndices() {
        this._getRows().forEach((row, i) => {
            const idx = i + 1;
            row.dataset.index = idx;
            const indexSpan = row.querySelector('.row-index');
            if (indexSpan) indexSpan.textContent = idx;
            row.querySelectorAll('[name]').forEach(input => {
                input.name = input.name.replace(/items\[\d+\]/, `items[${idx}]`);
            });
            const removeBtn = row.querySelector('.btn-remove-row');
            if (removeBtn) removeBtn.disabled = idx === 1;
        });
    }

    _createRow(idx) {
        const tr = document.createElement('tr');
        tr.className = `${this.options.rowSelector.slice(1)} quick-order-row--new`;
        tr.dataset.index = idx;
        tr.innerHTML = `
            <td class="quick-order-col-index"><span class="row-index text-muted">${idx}</span></td>
            <td class="quick-order-col-sku">
                <input type="text" name="items[${idx}][sku]"
                       class="form-control ${this.options.skuSelector.slice(1)}"
                       placeholder="z. B. SW10001" autocomplete="off" autocapitalize="off" spellcheck="false">
            </td>
            <td class="quick-order-col-qty">
                <div class="input-group input-group-sm">
                    <button type="button" class="btn btn-outline-secondary btn-qty-minus" title="Verringern">−</button>
                    <input type="number" name="items[${idx}][quantity]"
                           class="form-control ${this.options.qtySelector.slice(1)} text-center"
                           value="1" min="1" max="9999" style="max-width: 60px">
                    <button type="button" class="btn btn-outline-secondary btn-qty-plus" title="Erhöhen">+</button>
                </div>
            </td>
            <td class="quick-order-col-action">
                <button type="button" class="btn btn-icon btn-remove-row"
                        title="Zeile entfernen" aria-label="Zeile entfernen">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                </button>
            </td>`;

        requestAnimationFrame(() => tr.classList.remove('quick-order-row--new'));
        return tr;
    }

    _onAddRow() {
        const row = this._createRow(this._getNextIndex());
        this._tbody.appendChild(row);
        row.querySelector(this.options.skuSelector).focus();
        this._updateIndices();
    }

    _onRemoveRow(event) {
        const btn = event.target.closest('.btn-remove-row');
        if (!btn || btn.disabled) return;
        const row = btn.closest(this.options.rowSelector);
        if (!row) return;
        row.style.animation = 'qo-fade-out 150ms ease forwards';
        row.addEventListener('animationend', () => {
            row.remove();
            this._updateIndices();
        }, { once: true });
    }

    _onQtyButtonClick(event) {
        const minusBtn = event.target.closest('.btn-qty-minus');
        const plusBtn = event.target.closest('.btn-qty-plus');

        if (minusBtn) {
            event.preventDefault();
            event.stopPropagation();
            const qtyInput = minusBtn.closest('.input-group').querySelector(this.options.qtySelector);
            if (qtyInput) {
                const val = parseInt(qtyInput.value, 10) || 1;
                if (val > 1) {
                    qtyInput.value = val - 1;
                }
            }
            return;
        }

        if (plusBtn) {
            event.preventDefault();
            event.stopPropagation();
            const qtyInput = plusBtn.closest('.input-group').querySelector(this.options.qtySelector);
            if (qtyInput) {
                const val = parseInt(qtyInput.value, 10) || 1;
                const max = parseInt(qtyInput.max, 10) || 9999;
                if (val < max) {
                    qtyInput.value = val + 1;
                }
            }
            return;
        }
    }

    _onClear() {
        this._getRows().forEach((row, i) => {
            if (i === 0) {
                row.querySelectorAll('input').forEach(inp => {
                    inp.value = inp.type === 'number' ? 1 : '';
                });
            } else {
                row.remove();
            }
        });
        this._updateIndices();
    }

    _onTabLastRow(event) {
        if (event.key !== 'Tab' || event.shiftKey) return;
        const rows = this._getRows();
        const lastRow = rows[rows.length - 1];
        if (!lastRow) return;
        const lastQty = lastRow.querySelector(this.options.qtySelector);
        if (event.target === lastQty) {
            event.preventDefault();
            this._onAddRow();
        }
    }

    /**
     * Client-side: strip empty rows before submit so the server
     * does not receive blank SKU entries.
     */
    _onSubmit() {
        this._getRows().forEach(row => {
            const sku = row.querySelector(this.options.skuSelector);
            if (sku && sku.value.trim() === '') {
                row.querySelectorAll('[name]').forEach(inp => inp.disabled = true);
            }
        });
    }
}

PluginManager.register('QuickOrder', QuickOrderPlugin, '[data-quick-order]');
