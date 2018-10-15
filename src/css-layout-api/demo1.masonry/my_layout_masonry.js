registerLayout('masonry', class {
  static get inputProperties() {
    return [ '--padding', '--columns' ]; 
  }
  
  *intrinsicSizes() { /* TODO */ }

  /**
   * 渲染引擎，在浏览器的layou 阶段时的回调
   * @param children 要执行layout元素的子元素列表
   * @param edges 在 logical coordinate system 里的 borders, scrollbar 和 padding 的大小
   * @param constraints 生成的片段应该满足的条件，该对象里提前计算了当前layout的一些属性。
   *                    eg. inline-size (width), block-size (height)
   * @param styleMap 当前layout的只读style
   */
  *layout(children, edges, constraints, styleMap) {
    // 1. 确定当前layout的内部大小, width
    const inlineSize = constraints.fixedInlineSize;

    const padding = parseInt(styleMap.get('--padding').toString());
    const columnValue = styleMap.get('--columns').toString();

    let columns = parseInt(columnValue);
    if (columnValue == 'auto' || !columns) {
      columns = Math.ceil(inlineSize / 350); // 默认每个宽350px
    }

    const childInlineSize = (inlineSize - ((columns + 1) * padding)) / columns;
    const childFragments = yield children.map((child) => {
      // 2. 对子节点进行布局，根据 columns
      return child.layoutNextFragment({fixedInlineSize: childInlineSize}); // 第一个参数是给子元素的“constraints”
    });

    // 3. 算出'auto'块的大小。就能知道子元素的最大 height
    let autoBlockSize = 0;
    const columnOffsets = Array(columns).fill(0);
    for (let childFragment of childFragments) {
      const min = columnOffsets.reduce((acc, val, idx) => {
        if (!acc || val < acc.val) {
          return {idx, val};
        }

        return acc;
      }, {val: +Infinity, idx: -1});

      // 设置相对于父元素的 offset（再其它的属性都是只读的）
      childFragment.inlineOffset = padding + (childInlineSize + padding) * min.idx;
      childFragment.blockOffset = padding + min.val;

      columnOffsets[min.idx] = childFragment.blockOffset + childFragment.blockSize;
      autoBlockSize = Math.max(autoBlockSize, columnOffsets[min.idx] + padding);
    }

    // 4. 返回 fragment
    return {autoBlockSize, childFragments};
  }
});