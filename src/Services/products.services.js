const Models = require('../../models')
const ProductIndividualsServices = require('./productIndividuals.services')

async function findProductById(id) {
    return await Models.Products.findOne({
        where: {
            id
        }
    })
}

async function findAllProducts () {
        return await Models.Products.findAll()
}

async function findProductCharacteristics(product_id) {
    const products = await ProductIndividualsServices.findAllProductIndividualsByProductId(product_id)

    const uniqueColorsMap = new Map()
    products.forEach(p => {
      const c = p.Color;
      if (!uniqueColorsMap.has(c.id)) {
        uniqueColorsMap.set(c.id, {
          id: c.id,
          name: c.name,
          code: c.code
        });
      }
    })
    const colors = Array.from(uniqueColorsMap.values())

    const uniqueSizesMap = new Map()
    products.forEach(p => {
      const c = p.Size;
      if (!uniqueSizesMap.has(c.id)) {
        uniqueSizesMap.set(c.id, {
          id: c.id,
          name: c.name
        });
      }
    })
    const sizes = Array.from(uniqueSizesMap.values())

    const uniqueStylesMap = new Map()
    products.forEach(p => {
      const c = p.Style;
      if (!uniqueStylesMap.has(c.id)) {
        uniqueStylesMap.set(c.id, {
          id: c.id,
          name: c.name,
          image_data: c.image_data
        });
      }
    })
    const styles = Array.from(uniqueStylesMap.values())

    console.log('---> Found this from characteristics search:', products, {colors, sizes, styles})

    return {
        colors,
        sizes,
        styles
    }
}

async function findProductCharacteristicsByColor(product_id, color_id) {
    const products = await ProductIndividualsServices.findAllProductIndividualsByProductIdAndColorId(product_id, color_id)

    const uniqueColorsMap = new Map()
    products.forEach(p => {
      const c = p.Color;
      if (!uniqueColorsMap.has(c.id)) {
        uniqueColorsMap.set(c.id, {
          id: c.id,
          name: c.name,
          code: c.code
        });
      }
    })
    const colors = Array.from(uniqueColorsMap.values())

    const uniqueSizesMap = new Map()
    products.forEach(p => {
      const c = p.Size;
      if (!uniqueSizesMap.has(c.id)) {
        uniqueSizesMap.set(c.id, {
          id: c.id,
          name: c.name
        });
      }
    })
    const sizes = Array.from(uniqueSizesMap.values())

    const uniqueStylesMap = new Map()
    products.forEach(p => {
      const c = p.Style;
      if (!uniqueStylesMap.has(c.id)) {
        uniqueStylesMap.set(c.id, {
          id: c.id,
          name: c.name,
          image_data: c.image_data
        });
      }
    })
    const styles = Array.from(uniqueStylesMap.values())

    console.log('---> Found this from characteristics search 2:', products, {colors, sizes, styles})

    return {
        colors,
        sizes,
        styles
    }
}

module.exports = {
    findProductById,
    findAllProducts,
    findProductCharacteristics,
    findProductCharacteristicsByColor
}
