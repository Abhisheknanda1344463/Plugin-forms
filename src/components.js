export default function(editor, opt = {}) {
  const c = opt;
  const domc = editor.DomComponents;
  const defaultType = domc.getType('default');
  const textType = domc.getType('text');
  const defaultModel = defaultType.model;
  const defaultView = defaultType.view;
  const textModel = textType.model;
  const textView = textType.view;

  let stateNormal = 'Normal';
  let stateSuccess = 'Success';
  let stateError = 'Error';
  let formMsgSuccess = 'Thanks! We received your request'
  let formMsgError = 'An error occurred on processing your request, try again!'

  const idTrait = {
    name: 'id',
    label: c.labelTraitId,
  };

  const forTrait = {
    name: 'for',
    label: c.labelTraitFor,
  };

  const nameTrait = {
    name: 'name',
    label: c.labelTraitName,
  };

  const placeholderTrait = {
    name: 'placeholder',
    label: c.labelTraitPlaceholder,
  };

  const valueTrait = {
    name: 'value',
    label: c.labelTraitValue,
  };

  const requiredTrait = {
    type: 'checkbox',
    name: 'required',
    label: c.labelTraitRequired,
  };

  const checkedTrait = {
    label: c.labelTraitChecked,
    type: 'checkbox',
    name: 'checked',
  };

  const preventDefaultClick = () => {
    return defaultType.view.extend({
      events: {
        'mousedown': 'handleClick',
      },

      handleClick(e) {
        e.preventDefault();
      },
    });
  };

  domc.addType('form', {
    model: defaultModel.extend({
      defaults: {
        ...defaultModel.prototype.defaults,
        droppable: ':not(form)',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .89-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5a2 2 0 0 0-2-2m0 2v14H5V5h14z"></path></svg>`,
        attributes: { method: 'post', 'data-redirect': "" },
        redirect: 'page',
        draggable: ':not(form)',
        traits: [{
          label: c.labelTraitdefaultName,
          placeholder: 'eg. Top Form',
          name: 'name',
        },{
          type: 'select',
          label: c.labelTraitMethod,
          name: 'method',
          options: [
            {value: 'get', name: 'GET'},
            {value: 'post', name: 'POST'},
          ],
        },{
          label: c.labelTraitAction,
          name: 'action',
          placeholder: 'Webbuilder',
        },{
          type: 'select',
          label: c.labelTraitState,
          name: 'formState',
          changeProp: 1,
          options: [
            {value: '', name: c.labelStateNormal},
            {value: 'success', name: c.labelStateSuccess},
            {value: 'error', name: c.labelStateError},
          ]
        }],
      },

      init() {
        this.listenTo(this, 'change:formState', this.updateFormState);
      },

      updateFormState() {
        var state = this.get('formState');
        switch (state) {
          case 'success':
            this.showState('success');
            break;
          case 'error':
            this.showState('error');
            break;
          default:
            this.showState('normal');
        }
      },

      showState(state) {
        var st = state || 'normal';
        var failVis, successVis;
        if (st == 'success') {
          failVis = 'none';
          successVis = 'block';
        } else if (st == 'error') {
          failVis = 'block';
          successVis = 'none';
        } else {
          failVis = 'none';
          successVis = 'none';
        }
        var successModel = this.getStateModel('success');
        var failModel = this.getStateModel('error');
        var successStyle = successModel.getStyle();
        var failStyle = failModel.getStyle();
        successStyle.display = successVis;
        failStyle.display = failVis;
        successModel.setStyle(successStyle);
        failModel.setStyle(failStyle);
      },

      getStateModel(state) {
        var st = state || 'success';
        var stateName = 'form-state-' + st;
        var stateModel;
        var comps = this.get('components');
        for (var i = 0; i < comps.length; i++) {
          var model = comps.models[i];
          if(model.get('form-state-type') == st) {
            stateModel = model;
            break;
          }
        }
        if (!stateModel) {
          var contentStr = formMsgSuccess;
          if(st == 'error') {
            contentStr = formMsgError;
          }
          stateModel = comps.add({
            'form-state-type': st,
            type: 'text',
            removable: false,
            copyable: false,
            draggable: false,
            attributes: {'data-form-state': st, 'class': 'state-' + st},
            content: contentStr,
          });
        }
        return stateModel;
      },
    }, {
      isComponent(el) {
        if(el.tagName == 'FORM'){
          return {type: 'form'};
        }
      },
    }),

    view: defaultView.extend({
      events: {
        submit(e) {
          e.preventDefault();
        }
      }
    }),
  });





  // INPUT
  domc.addType('input', {
    model: defaultModel.extend({
      defaults: {
        ...defaultModel.prototype.defaults,
        name: c.labelInputName,
        tagName: 'input',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .89-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5a2 2 0 0 0-2-2m0 2v14H5V5h14z"></path></svg>`,
        draggable: 'form, form *',
        droppable: false,
        traits: [
          nameTrait,
          placeholderTrait, {
            label: c.labelTraitType,
            type: 'select',
            name: 'type',
            options: [
              {value: 'text', name: c.labelTypeText},
              {value: 'email', name: c.labelTypeEmail},
              {value: 'password', name: c.labelTypePassword},
              {value: 'number', name: c.labelTypeNumber},
            ]
          }, requiredTrait
        ],
      },
    }, {
      isComponent(el) {
        if(el.tagName == 'INPUT') {
          return {type: 'input'};
        }
      },
    }),
    view: defaultView,
  });

  var inputType = domc.getType('input');
  var inputModel = inputType.model;





  // TEXTAREA
  domc.addType('textarea', {
    model: inputType.model.extend({
      defaults: {
        ...inputModel.prototype.defaults,
        name: c.labelTextareaName,
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .89-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5a2 2 0 0 0-2-2m0 2v14H5V5h14z"></path></svg>`,
        tagName: 'textarea',
        traits: [
          nameTrait,
          placeholderTrait,
          requiredTrait
        ]
      },
    }, {
      isComponent(el) {
        if(el.tagName == 'TEXTAREA'){
          return {type: 'textarea'};
        }
      },
    }),
    view: defaultView,
  });





  // SELECT
  domc.addType('select', {
    model: defaultModel.extend({
      defaults: {
        ...inputModel.prototype.defaults,
        name: c.labelSelectName,
        tagName: 'select',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .89-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5a2 2 0 0 0-2-2m0 2v14H5V5h14z"></path></svg>`,
        traits: [
          nameTrait, {
            label: c.labelTraitOptions,
            type: 'select-options'
          },
          requiredTrait
        ],
      },
    }, {
      isComponent(el) {
        if(el.tagName == 'SELECT'){
          return {type: 'select'};
        }
      },
    }),
    view: preventDefaultClick(),
  });





  // CHECKBOX
  domc.addType('checkbox', {
    model: defaultModel.extend({
      defaults: {
        ...inputModel.prototype.defaults,
        name: c.labelCheckboxName,
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .89-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5a2 2 0 0 0-2-2m0 2v14H5V5h14z"></path></svg>`,
        copyable: false,
        attributes: {type: 'checkbox'},
        traits: [
          idTrait,
          nameTrait,
          valueTrait,
          requiredTrait,
          checkedTrait
        ],
      },

    }, {
      isComponent(el) {
        if (el.tagName == 'INPUT' && el.type == 'checkbox') {
          return { type: 'checkbox' };
        }
      },
    }),
    view: defaultView.extend({
      events: {
        'click': 'handleClick',
      },

      handleClick(e) {
        e.preventDefault();
      },

      init() {
        this.listenTo(this.model, 'change:attributes:checked', this.handleChecked);
      },

      handleChecked() {
        this.el.checked = !!this.model.get('attributes').checked;
      },
    }),
  });

  var checkType = domc.getType('checkbox');





  // RADIO
  domc.addType('radio', {
     model: checkType.model.extend({
       defaults: {
         ...checkType.model.prototype.defaults,
         icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .89-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5a2 2 0 0 0-2-2m0 2v14H5V5h14z"></path></svg>`,
         name: c.labelRadioName,
         attributes: {type: 'radio'},
       },
     }, {
       isComponent(el) {
         if(el.tagName == 'INPUT' && el.type == 'radio'){
           return {type: 'radio'};
         }
       },
     }),
     view: checkType.view,
  });
  // LABEL
  domc.addType('label', {
    model: textModel.extend({
      defaults: {
        ...textModel.prototype.defaults,
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .89-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5a2 2 0 0 0-2-2m0 2v14H5V5h14z"></path></svg>`,
        name: c.labelNameLabel,
        tagName: 'label',
        traits: [forTrait],
      },
    }, {
      isComponent(el) {
        if(el.tagName == 'LABEL'){
          return {type: 'label'};
        }
      },
    }),
    view: textView,
  });


  // form group
  domc.addType('form group', {
    model: {
      defaults: {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .89-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5a2 2 0 0 0-2-2m0 2v14H5V5h14z"></path></svg>`,
      },
    }
  });
}
