import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    {
      type: 'category',
      label: 'Table of Contents',
      link: {
        type: 'doc',
        id: 'table-of-contents/index'
      },
      items: [
        'table-of-contents/index'
      ],
    },
    {
      type: 'category',
      label: 'Basics',
      link: {
        type: 'doc',
        id: 'basics/index'
      },
      items: [
        'basics/index',
        'basics/monobehaviour-https-docs-unity3d-com-scriptreference-monobehaviour-html',
        'basics/transform-https-docs-unity3d-com-scriptreference-transform-html',
        'basics/vector3-https-docs-unity3d-com-scriptreference-vector3-html',
        'basics/quaternion-https-docs-unity3d-com-scriptreference-quaternion-html',
        'basics/euler-angles'
      ],
    },
    {
      type: 'category',
      label: 'Movement & Rotation',
      link: {
        type: 'doc',
        id: 'movement-rotation/index'
      },
      items: [
        'movement-rotation/index',
        'movement-rotation/move-object',
        'movement-rotation/rotate-object'
      ],
    },
    {
      type: 'category',
      label: 'Physics',
      link: {
        type: 'doc',
        id: 'physics/index'
      },
      items: [
        'physics/index',
        'physics/raycast',
        'physics/ignorecollision'
      ],
    },
    {
      type: 'category',
      label: 'Input',
      link: {
        type: 'doc',
        id: 'input/index'
      },
      items: [
        'input/index',
        'input/keyboard',
        'input/mouse',
        'input/touch'
      ],
    },
    {
      type: 'category',
      label: 'UI',
      link: {
        type: 'doc',
        id: 'ui/index'
      },
      items: [
        'ui/index',
        'ui/button',
        'ui/slider'
      ],
    },
    {
      type: 'category',
      label: 'Audio',
      link: {
        type: 'doc',
        id: 'audio/index'
      },
      items: [
        'audio/index',
        'audio/basic-audio-play'
      ],
    },
    {
      type: 'category',
      label: 'Scripting',
      link: {
        type: 'doc',
        id: 'scripting/index'
      },
      items: [
        'scripting/index',
        'scripting/coroutines',
        'scripting/event-systems',
        'scripting/scriptable-objects',
        'scripting/custom-editor-scripts'
      ],
    },
    {
      type: 'category',
      label: 'Design Patterns',
      link: {
        type: 'doc',
        id: 'design-patterns/index'
      },
      items: [
        'design-patterns/index',
        'design-patterns/singleton',
        'design-patterns/factory-pattern',
        'design-patterns/observer-pattern',
        'design-patterns/command-pattern',
        'design-patterns/state-pattern',
        'design-patterns/strategy-pattern',
        'design-patterns/object-pooling-pattern',
        'design-patterns/chain-of-responsibility-pattern'
      ],
    },
    {
      type: 'category',
      label: 'Practical Use Cases',
      link: {
        type: 'doc',
        id: 'practical-use-cases/index'
      },
      items: [
        'practical-use-cases/index',
        'practical-use-cases/check-if-object-is-on-the-ground',
        'practical-use-cases/get-the-transform-of-a-body-bone',
        'practical-use-cases/make-object-look-at-the-camera',
        'practical-use-cases/load-next-scene'
      ],
    }
  ],
};

export default sidebars;
