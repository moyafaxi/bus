# Usage
```
import bus from 'bus.js';

bus.on('test', () => {});

bus.fire('test', 'qweeqwe');

bus.off('test');
```