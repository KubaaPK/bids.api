import { CategoriesNames } from '../../dtos/write/calculatable-offer.dto';
import { Calculatable } from './calculatable';
import * as categoriesStrategies from './categories';

export class CategoriesStrategiesMap {
  // prettier-ignore
  public static generate(): Map<CategoriesNames, Calculatable> {
    const map: Map<CategoriesNames, Calculatable> = new Map<CategoriesNames, Calculatable>();
    map.set(CategoriesNames.SMARTPHONES, new categoriesStrategies.Smartphones());
    map.set(CategoriesNames.SMARTWATCHES, new categoriesStrategies.Smartwatches());
    map.set(CategoriesNames.TABLETS, new categoriesStrategies.Tablets());
    map.set(CategoriesNames.ACCESSORIES_GSM, new categoriesStrategies.AccessoriesGsm());
    map.set(CategoriesNames.LAPTOPS, new categoriesStrategies.Laptops());
    map.set(CategoriesNames.MONITORS, new categoriesStrategies.Monitors());
    map.set(CategoriesNames.PCS, new categoriesStrategies.Pcs());
    map.set(CategoriesNames.PRINTERS_AND_SCANNERS, new categoriesStrategies.PrintersAndScanners());
    map.set(CategoriesNames.PROJECTORS, new categoriesStrategies.Projectors());
    map.set(CategoriesNames.TVS, new categoriesStrategies.Tvs());
    map.set(CategoriesNames.FRAGRANCES_FOR_MEN, new categoriesStrategies.FragrancesForMen());
    map.set(CategoriesNames.FRAGRANCES_FOR_WOMEN, new categoriesStrategies.FragrancesForWomen());
    map.set(CategoriesNames.HAIRPASTE, new categoriesStrategies.Hairpaste());
    map.set(CategoriesNames.MAKEUP, new categoriesStrategies.Makeup());
    map.set(CategoriesNames.SHAVING, new categoriesStrategies.Shaving());
    map.set(CategoriesNames.BOOKS, new categoriesStrategies.Books());
    map.set(CategoriesNames.GAMES, new categoriesStrategies.Games());
    map.set(CategoriesNames.MOVIES, new categoriesStrategies.Movies());
    map.set(CategoriesNames.MUSIC, new categoriesStrategies.Music());
    map.set(CategoriesNames.FEMALE_CLOTHING, new categoriesStrategies.FemaleClothing());
    map.set(CategoriesNames.FEMALE_JEWELRY, new categoriesStrategies.FemaleJewelry());
    map.set(CategoriesNames.FEMALE_SHOES, new categoriesStrategies.FemaleShoes());
    map.set(CategoriesNames.FEMALE_WATCHES, new categoriesStrategies.FemaleWatches());
    map.set(CategoriesNames.MALE_CLOTHING, new categoriesStrategies.MaleClothing());
    map.set(CategoriesNames.MALE_JEWELRY, new categoriesStrategies.MaleJewelry());
    map.set(CategoriesNames.MALE_SHOES, new categoriesStrategies.MaleShoes());
    map.set(CategoriesNames.MALE_WATCHES, new categoriesStrategies.MaleWatches());
    map.set(CategoriesNames.BLOOD_PRESSURE_MONITORS, new categoriesStrategies.BloodPressureMonitors());
    map.set(CategoriesNames.DIETARY_SUPPLEMENTS, new categoriesStrategies.DietarySupplements());
    map.set(CategoriesNames.ELECTRIC_BRUSHES, new categoriesStrategies.ElectricBrushes());
    map.set(CategoriesNames.MASSAGE_EQUIPMENT, new categoriesStrategies.MassageEquipment());
    map.set(CategoriesNames.REHABILITATION, new categoriesStrategies.Rehabilitation());
    map.set(CategoriesNames.TEETH_WHITENING, new categoriesStrategies.TeethWhitening());
    map.set(CategoriesNames.THERMOMETERS, new categoriesStrategies.Thermometers());
    map.set(CategoriesNames.TOOTHPASTES, new categoriesStrategies.Toothpastes());
    map.set(CategoriesNames.GARDENING_TOOLS, new categoriesStrategies.GardeningTools());
    map.set(CategoriesNames.IRRIGATION, new categoriesStrategies.Irrigation());
    map.set(CategoriesNames.LAMP_ACCESSORIES, new categoriesStrategies.LampAccessories());
    map.set(CategoriesNames.LAMPS, new categoriesStrategies.Lamps());
    map.set(CategoriesNames.PLANTS, new categoriesStrategies.Plants());
    map.set(CategoriesNames.SAWS_AND_CHAINSAWS, new categoriesStrategies.SawsAndChainsaws());
    map.set(CategoriesNames.SCREWDRIVERS, new categoriesStrategies.Screwdrivers());
    map.set(CategoriesNames.WELDERS, new categoriesStrategies.Welders());
    map.set(CategoriesNames.BICYCLES_AND_ACCESSORIES, new categoriesStrategies.BicyclesAndAccessories());
    map.set(CategoriesNames.GYM_AND_FITNESS, new categoriesStrategies.GymAndFitness());
    map.set(CategoriesNames.SKATING_SLACKLINE, new categoriesStrategies.SkatingSlackline());

    return map;
  }
}
