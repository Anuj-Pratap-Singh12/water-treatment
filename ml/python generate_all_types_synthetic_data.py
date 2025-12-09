"""
Synthetic dataset generator for all 5 water types.

Types:
 1 – Drinking / Potable Water
 2 – Domestic / Grey Water (STP)
 3 – Treated Wastewater (Recycle, MBR)
 4 – Industrial Effluent (High TDS / metals)
 5 – High Organic Load Wastewater

Common INPUTS:
  - type (1–5)
  - pH
  - TDS_mgL
  - turbidity_NTU
  - BOD_mgL
  - COD_mgL
  - total_nitrogen_mgL
  - temperature_C
  - flow_m3_day
  - total_volume_L_day
  - heavy_metals (0/1)

Each type has its own:
  - Stage detention times (minutes)
  - Equipment labels per stage
  - CAPEX, OPEX, cost_per_m3_inr

You can train:
  - A classifier on (inputs → type)
  - Separate models per type on (inputs → times, equipment, cost)
"""

import numpy as np
import pandas as pd


# ---------------------------- TYPE 1 – DRINKING WATER ----------------------------

def generate_type1(n_samples: int = 800, random_state: int = 1) -> pd.DataFrame:
    """
    Type 1 – Drinking / Potable Water
    Sequence:
      Screening → Coagulation & Flocculation → Sedimentation
      → Filtration (Sand/Carbon) → Activated Carbon Polishing → Disinfection
    """
    rng = np.random.default_rng(random_state)
    rows = []

    for _ in range(n_samples):
        w_type = 1

        # Water quality – relatively clean but needs polishing
        pH = rng.uniform(6.5, 8.5)
        TDS = rng.uniform(100, 1200)
        turbidity = rng.uniform(0.5, 50)
        BOD = rng.uniform(1, 15)
        COD = rng.uniform(5, 50)
        total_n = rng.uniform(0.5, 10)
        temperature = rng.uniform(10, 35)
        flow_m3_day = rng.uniform(100, 5000)
        total_volume_L_day = flow_m3_day * 1000
        # Most potable sources have negligible heavy metals
        heavy_metals = int(rng.random() < 0.05)

        # Helper indices
        turbidity_index = np.clip(turbidity / 30.0, 0.2, 3.0)
        organics_index = np.clip((BOD / 5.0 + COD / 25.0) / 2.0, 0.2, 3.0)

        # Stage times (minutes)
        t_screening = float(rng.uniform(0.5, 2.0))

        base_coag = rng.uniform(15.0, 30.0)
        t_coag_floc = base_coag * (0.7 + 0.5 * turbidity_index)

        base_sed = rng.uniform(60.0, 180.0)
        t_sedimentation = base_sed * (0.7 + 0.3 * turbidity_index)

        base_filtration = rng.uniform(10.0, 30.0)
        t_filtration = base_filtration * (0.7 + 0.4 * organics_index)

        base_carbon = rng.uniform(5.0, 20.0)
        t_carbon_polishing = base_carbon * (0.7 + 0.6 * organics_index)

        base_disinf = rng.uniform(5.0, 30.0)
        t_disinfection = base_disinf * (0.7 + 0.4 * organics_index)

        # Clamp
        t_screening = float(np.clip(t_screening, 0.5, 5.0))
        t_coag_floc = float(np.clip(t_coag_floc, 5.0, 60.0))
        t_sedimentation = float(np.clip(t_sedimentation, 30.0, 240.0))
        t_filtration = float(np.clip(t_filtration, 5.0, 60.0))
        t_carbon_polishing = float(np.clip(t_carbon_polishing, 3.0, 60.0))
        t_disinfection = float(np.clip(t_disinfection, 3.0, 60.0))

        # Equipment
        if turbidity < 10:
            equip_screening = "coarse_bar_screen"
        else:
            equip_screening = "fine_bar_screen"

        if turbidity < 10:
            equip_coag_floc = "rapid_mixer_light"
        elif turbidity < 30:
            equip_coag_floc = "rapid_mixer_standard"
        else:
            equip_coag_floc = "rapid_mixer_high_rate"

        if flow_m3_day < 1000:
            equip_sedimentation = "circular_clarifier"
        else:
            equip_sedimentation = "hopper_bottom_clarifier"

        if turbidity < 10:
            equip_filtration = "rapid_sand_filter"
        else:
            equip_filtration = "dual_media_filter"

        equip_carbon_polishing = "pressure_carbon_filter"

        if flow_m3_day < 1000:
            equip_disinfection = "uv_disinfection"
        else:
            equip_disinfection = "chlorination_system"

        # Cost model – potable train cheaper than industrial
        base_capex = 3e5
        time_sum_hours = (t_coag_floc + t_sedimentation +
                          t_filtration + t_carbon_polishing +
                          t_disinfection) / 60.0

        capex_inr = (
            base_capex
            + 1500.0 * flow_m3_day
            + 10.0 * TDS
            + 5e3 * organics_index * time_sum_hours
        )

        base_opex = 5e3
        chem_cost = 3.0 * flow_m3_day * turbidity_index
        carbon_cost = 2.0 * flow_m3_day * organics_index
        disinf_cost = 1.5 * flow_m3_day

        opex_per_day_inr = base_opex + chem_cost + carbon_cost + disinf_cost
        cost_per_m3_inr = opex_per_day_inr / flow_m3_day

        row = {
            "type": w_type,
            "pH": pH,
            "TDS_mgL": TDS,
            "turbidity_NTU": turbidity,
            "BOD_mgL": BOD,
            "COD_mgL": COD,
            "total_nitrogen_mgL": total_n,
            "temperature_C": temperature,
            "flow_m3_day": flow_m3_day,
            "total_volume_L_day": total_volume_L_day,
            "heavy_metals": heavy_metals,

            "t_screening_min": t_screening,
            "t_coag_floc_min": t_coag_floc,
            "t_sedimentation_min": t_sedimentation,
            "t_filtration_min": t_filtration,
            "t_carbon_polishing_min": t_carbon_polishing,
            "t_disinfection_min": t_disinfection,

            "equip_screening": equip_screening,
            "equip_coag_floc": equip_coag_floc,
            "equip_sedimentation": equip_sedimentation,
            "equip_filtration": equip_filtration,
            "equip_carbon_polishing": equip_carbon_polishing,
            "equip_disinfection": equip_disinfection,

            "capex_inr": capex_inr,
            "opex_per_day_inr": opex_per_day_inr,
            "cost_per_m3_inr": cost_per_m3_inr,
        }
        rows.append(row)

    return pd.DataFrame(rows)


# ---------------------------- TYPE 2 – DOMESTIC / GREY WATER ----------------------------

def generate_type2(n_samples: int = 800, random_state: int = 2) -> pd.DataFrame:
    """
    Type 2 – Domestic / Grey Water (STP)
    Sequence:
      Screening → Oil & Grease Removal → Equalization
      → Coag–Floc → Primary Clarifier → Aeration
      → Secondary Clarifier → Filtration → Disinfection
    """
    rng = np.random.default_rng(random_state)
    rows = []

    for _ in range(n_samples):
        w_type = 2

        # Domestic sewage – moderate TDS, high BOD/COD
        pH = rng.uniform(6.0, 8.5)
        TDS = rng.uniform(300, 1500)
        turbidity = rng.uniform(20, 300)
        BOD = rng.uniform(150, 400)
        COD = rng.uniform(300, 800)
        total_n = rng.uniform(15, 60)
        temperature = rng.uniform(15, 40)
        flow_m3_day = rng.uniform(200, 10000)
        total_volume_L_day = flow_m3_day * 1000
        heavy_metals = 0  # usually negligible in domestic

        organic_index = np.clip(BOD / 250.0, 0.4, 3.0)
        grease_index = np.clip(turbidity / 150.0, 0.3, 3.0)

        # Stage times
        t_screening = float(rng.uniform(1.0, 3.0))

        base_oil = rng.uniform(10.0, 25.0)
        t_oil_grease = base_oil * (0.8 + 0.6 * grease_index)

        base_eq = rng.uniform(60.0, 240.0)
        t_equalization = base_eq * (0.8 + 0.4 * (flow_m3_day / 5000.0))

        base_coag = rng.uniform(15.0, 45.0)
        t_coag_floc = base_coag * (0.8 + 0.4 * grease_index)

        base_primary = rng.uniform(60.0, 180.0)
        t_primary = base_primary * (0.8 + 0.4 * organic_index)

        base_aer = rng.uniform(180.0, 720.0)  # 3–12 h
        t_aeration = base_aer * (0.8 + 0.4 * organic_index)

        base_secondary = rng.uniform(90.0, 240.0)
        t_secondary = base_secondary * (0.8 + 0.4 * organic_index)

        base_filter = rng.uniform(10.0, 30.0)
        t_filtration = base_filter * (0.8 + 0.4 * organic_index)

        base_disinf = rng.uniform(15.0, 45.0)
        t_disinfection = base_disinf * (0.8 + 0.3 * organic_index)

        # Clamp
        t_screening = float(np.clip(t_screening, 0.5, 5.0))
        t_oil_grease = float(np.clip(t_oil_grease, 5.0, 60.0))
        t_equalization = float(np.clip(t_equalization, 30.0, 360.0))
        t_coag_floc = float(np.clip(t_coag_floc, 10.0, 60.0))
        t_primary = float(np.clip(t_primary, 30.0, 240.0))
        t_aeration = float(np.clip(t_aeration, 120.0, 960.0))
        t_secondary = float(np.clip(t_secondary, 60.0, 360.0))
        t_filtration = float(np.clip(t_filtration, 10.0, 60.0))
        t_disinfection = float(np.clip(t_disinfection, 10.0, 60.0))

        # Equipment
        equip_screening = "mechanical_bar_screen" if flow_m3_day > 3000 else "manual_bar_screen"

        equip_oil_grease = "cpi_separator" if flow_m3_day > 5000 else "api_separator"

        equip_equalization = "rectangular_eq_tank" if flow_m3_day > 3000 else "circular_eq_tank"

        equip_coag_floc = "flash_mixer_plus_flocculator"

        equip_primary = "primary_clarifier_circular"

        if flow_m3_day < 3000:
            equip_aeration = "extended_aeration"
        else:
            equip_aeration = "diffused_aeration"

        equip_secondary = "secondary_clarifier_circular"

        if BOD < 200:
            equip_filtration = "pressure_sand_filter"
        else:
            equip_filtration = "dual_media_filter"

        equip_disinfection = "chlorination"

        # Costs – aeration dominates OPEX
        base_capex = 8e5
        time_sum_hours = (t_aeration + t_equalization + t_primary + t_secondary) / 60.0

        capex_inr = (
            base_capex
            + 2500.0 * flow_m3_day
            + 2000.0 * organic_index * time_sum_hours
        )

        base_opex = 1.5e4
        aeration_power_cost = 12.0 * flow_m3_day * organic_index
        chem_cost = 4.0 * flow_m3_day
        sludge_cost = 3000.0 * organic_index

        opex_per_day_inr = base_opex + aeration_power_cost + chem_cost + sludge_cost
        cost_per_m3_inr = opex_per_day_inr / flow_m3_day

        row = {
            "type": w_type,
            "pH": pH,
            "TDS_mgL": TDS,
            "turbidity_NTU": turbidity,
            "BOD_mgL": BOD,
            "COD_mgL": COD,
            "total_nitrogen_mgL": total_n,
            "temperature_C": temperature,
            "flow_m3_day": flow_m3_day,
            "total_volume_L_day": total_volume_L_day,
            "heavy_metals": heavy_metals,

            "t_screening_min": t_screening,
            "t_oil_grease_min": t_oil_grease,
            "t_equalization_min": t_equalization,
            "t_coag_floc_min": t_coag_floc,
            "t_primary_clarifier_min": t_primary,
            "t_aeration_min": t_aeration,
            "t_secondary_clarifier_min": t_secondary,
            "t_filtration_min": t_filtration,
            "t_disinfection_min": t_disinfection,

            "equip_screening": equip_screening,
            "equip_oil_grease": equip_oil_grease,
            "equip_equalization": equip_equalization,
            "equip_coag_floc": equip_coag_floc,
            "equip_primary_clarifier": equip_primary,
            "equip_aeration": equip_aeration,
            "equip_secondary_clarifier": equip_secondary,
            "equip_filtration": equip_filtration,
            "equip_disinfection": equip_disinfection,

            "capex_inr": capex_inr,
            "opex_per_day_inr": opex_per_day_inr,
            "cost_per_m3_inr": cost_per_m3_inr,
        }
        rows.append(row)

    return pd.DataFrame(rows)


# ---------------------------- TYPE 3 – RECYCLE GRADE (MBR) ----------------------------

def generate_type3(n_samples: int = 800, random_state: int = 3) -> pd.DataFrame:
    """
    Type 3 – Treated Wastewater (Recycle Grade) – MBR-centric
    Sequence:
      Screening → Grit Chamber → Equalization
      → Biological Reactor → Membrane Bioreactor (MBR)
      → Activated Carbon Filter → Disinfection
    """
    rng = np.random.default_rng(random_state)
    rows = []

    for _ in range(n_samples):
        w_type = 3

        pH = rng.uniform(6.5, 8.5)
        TDS = rng.uniform(300, 2000)
        turbidity = rng.uniform(10, 200)
        BOD = rng.uniform(80, 250)
        COD = rng.uniform(200, 700)
        total_n = rng.uniform(10, 40)
        temperature = rng.uniform(15, 40)
        flow_m3_day = rng.uniform(200, 8000)
        total_volume_L_day = flow_m3_day * 1000
        heavy_metals = int(rng.random() < 0.1)

        organic_index = np.clip(BOD / 200.0, 0.5, 2.5)
        grit_index = np.clip(turbidity / 150.0, 0.3, 3.0)
        tds_index = np.clip(TDS / 1000.0, 0.3, 3.0)

        # Stage times
        t_screening = float(rng.uniform(1.0, 2.0))

        base_grit = rng.uniform(5.0, 20.0)
        t_grit = base_grit * (0.8 + 0.4 * grit_index)

        base_eq = rng.uniform(60.0, 240.0)
        t_equalization = base_eq * (0.8 + 0.4 * (flow_m3_day / 4000.0))

        base_bio = rng.uniform(180.0, 480.0)
        t_bio = base_bio * (0.8 + 0.5 * organic_index)

        base_mbr = rng.uniform(20.0, 60.0)
        t_mbr = base_mbr * (0.8 + 0.4 * tds_index)

        base_carbon = rng.uniform(10.0, 20.0)
        t_carbon = base_carbon * (0.8 + 0.5 * organic_index)

        base_disinf = rng.uniform(10.0, 30.0)
        t_disinfection = base_disinf * (0.8 + 0.4 * organic_index)

        # Clamp
        t_screening = float(np.clip(t_screening, 0.5, 5.0))
        t_grit = float(np.clip(t_grit, 5.0, 40.0))
        t_equalization = float(np.clip(t_equalization, 30.0, 360.0))
        t_bio = float(np.clip(t_bio, 120.0, 720.0))
        t_mbr = float(np.clip(t_mbr, 10.0, 90.0))
        t_carbon = float(np.clip(t_carbon, 5.0, 60.0))
        t_disinfection = float(np.clip(t_disinfection, 5.0, 60.0))

        # Equipment
        equip_screening = "fine_screen"

        equip_grit = "aerated_grit_chamber" if grit_index > 1.0 else "vortex_grit_chamber"

        equip_equalization = "eq_tank_with_mixing"

        equip_bio = "anoxic_aerobic_bioreactor"

        equip_mbr = "submerged_mbr" if flow_m3_day < 3000 else "external_mbr"

        equip_carbon = "pressure_carbon_filter"

        equip_disinfection = "uv_disinfection"

        # Cost – MBR + membranes expensive
        base_capex = 1.5e6
        time_sum_hours = (t_bio + t_mbr + t_equalization) / 60.0

        capex_inr = (
            base_capex
            + 3000.0 * flow_m3_day
            + 3e4 * time_sum_hours
            + 2e5 * heavy_metals
        )

        base_opex = 2e4
        aeration_cost = 14.0 * flow_m3_day * organic_index
        membrane_clean_cost = 5.0 * flow_m3_day * tds_index
        chem_cost = 3.0 * flow_m3_day

        opex_per_day_inr = base_opex + aeration_cost + membrane_clean_cost + chem_cost
        cost_per_m3_inr = opex_per_day_inr / flow_m3_day

        row = {
            "type": w_type,
            "pH": pH,
            "TDS_mgL": TDS,
            "turbidity_NTU": turbidity,
            "BOD_mgL": BOD,
            "COD_mgL": COD,
            "total_nitrogen_mgL": total_n,
            "temperature_C": temperature,
            "flow_m3_day": flow_m3_day,
            "total_volume_L_day": total_volume_L_day,
            "heavy_metals": heavy_metals,

            "t_screening_min": t_screening,
            "t_grit_chamber_min": t_grit,
            "t_equalization_min": t_equalization,
            "t_biological_reactor_min": t_bio,
            "t_mbr_min": t_mbr,
            "t_activated_carbon_min": t_carbon,
            "t_disinfection_min": t_disinfection,

            "equip_screening": equip_screening,
            "equip_grit_chamber": equip_grit,
            "equip_equalization": equip_equalization,
            "equip_biological_reactor": equip_bio,
            "equip_mbr": equip_mbr,
            "equip_activated_carbon": equip_carbon,
            "equip_disinfection": equip_disinfection,

            "capex_inr": capex_inr,
            "opex_per_day_inr": opex_per_day_inr,
            "cost_per_m3_inr": cost_per_m3_inr,
        }
        rows.append(row)

    return pd.DataFrame(rows)


# ---------------------------- TYPE 4 – INDUSTRIAL EFFLUENT ----------------------------

def generate_type4(n_samples: int = 1000, random_state: int = 4) -> pd.DataFrame:
    """
    Type 4 – Industrial Effluent
    Sequence:
      Screening → Neutralization → Chemical Precipitation
      → Heavy Metal Removal → Filter Press → Carbon Filter → RO
    (Same logic as we discussed earlier, slightly cleaned up)
    """
    rng = np.random.default_rng(random_state)
    rows = []

    for _ in range(n_samples):
        w_type = 4

        pH = rng.uniform(5.0, 9.0)
        TDS = rng.uniform(800, 6000)
        turbidity = rng.uniform(20, 500)
        BOD = rng.uniform(50, 800)
        COD = rng.uniform(150, 2500)
        total_n = rng.uniform(10, 100)
        temperature = rng.uniform(15, 40)
        flow_m3_day = rng.uniform(100, 5000)
        total_volume_L_day = flow_m3_day * 1000
        heavy_metals = int(rng.integers(0, 2))

        organic_index = float(np.clip((BOD / 300.0 + COD / 600.0) / 2.0, 0.3, 3.0))
        tds_index = float(np.clip(TDS / 2000.0, 0.4, 3.0))
        pH_dev = abs(pH - 7.0)

        # Stage times
        t_screening = float(rng.uniform(1.0, 3.0))

        base_neut = rng.uniform(30.0, 60.0)
        t_neutralization = base_neut * (1.0 + 0.12 * pH_dev) + heavy_metals * 5.0

        base_precip = rng.uniform(30.0, 60.0)
        t_precipitation = base_precip * (1.0 + 0.05 * tds_index + 0.05 * heavy_metals)

        if heavy_metals == 0:
            t_heavy_metal_removal = float(rng.uniform(10.0, 30.0))
        else:
            base_hm = rng.uniform(40.0, 90.0)
            t_heavy_metal_removal = base_hm * (0.8 + 0.4 * tds_index)

        base_fp = rng.uniform(45.0, 120.0)
        t_filter_press = base_fp * (0.7 + 0.6 * organic_index)

        base_cf = rng.uniform(10.0, 30.0)
        t_carbon_filter = base_cf * (0.8 + 0.4 * organic_index)

        base_ro = rng.uniform(30.0, 90.0)
        t_ro = base_ro * (0.7 + 0.4 * tds_index)

        # Clamp
        t_screening = float(np.clip(t_screening, 0.5, 10.0))
        t_neutralization = float(np.clip(t_neutralization, 10.0, 240.0))
        t_precipitation = float(np.clip(t_precipitation, 10.0, 240.0))
        t_heavy_metal_removal = float(np.clip(t_heavy_metal_removal, 10.0, 240.0))
        t_filter_press = float(np.clip(t_filter_press, 20.0, 240.0))
        t_carbon_filter = float(np.clip(t_carbon_filter, 5.0, 120.0))
        t_ro = float(np.clip(t_ro, 20.0, 240.0))

        # Equipment
        if flow_m3_day < 500:
            equip_screening = "coarse_bar_screen"
        elif turbidity > 200:
            equip_screening = "mechanical_screen"
        else:
            equip_screening = "fine_bar_screen"

        equip_neutralization = "batch_neutralization_tank" if flow_m3_day < 500 else "continuous_stirred_tank"

        equip_precipitation = "circular_clarifier" if flow_m3_day < 2000 else "rectangular_clarifier"

        if heavy_metals == 0:
            equip_hm = "none"
        else:
            equip_hm = "chemical_precipitation_unit" if TDS < 2500 else "precipitation_plus_ion_exchange"

        sludge_index = organic_index + 0.5 * heavy_metals
        equip_filter_press = "plate_and_frame_press" if sludge_index < 1.0 else "belt_filter_press"

        equip_carbon_filter = "pressure_carbon_filter" if COD < 800 else "gravity_carbon_filter"

        if TDS < 2000:
            equip_ro = "single_pass_ro"
        elif TDS < 4000:
            equip_ro = "double_pass_ro"
        else:
            equip_ro = "ro_with_energy_recovery"

        # Costs
        base_capex = 5e5
        time_sum_hours = (t_neutralization + t_precipitation +
                          t_heavy_metal_removal + t_filter_press +
                          t_carbon_filter + t_ro) / 60.0

        capex_inr = (
            base_capex
            + 2000.0 * flow_m3_day
            + 50.0 * TDS
            + heavy_metals * 2e5
            + 1e4 * organic_index * time_sum_hours
        )

        base_opex = 1e4
        chem_cost = 10.0 * flow_m3_day * organic_index
        ro_power_cost = 15.0 * flow_m3_day * tds_index
        sludge_cost = 2000.0 * sludge_index

        opex_per_day_inr = base_opex + chem_cost + ro_power_cost + sludge_cost
        cost_per_m3_inr = opex_per_day_inr / flow_m3_day

        row = {
            "type": w_type,
            "pH": pH,
            "TDS_mgL": TDS,
            "turbidity_NTU": turbidity,
            "BOD_mgL": BOD,
            "COD_mgL": COD,
            "total_nitrogen_mgL": total_n,
            "temperature_C": temperature,
            "flow_m3_day": flow_m3_day,
            "total_volume_L_day": total_volume_L_day,
            "heavy_metals": heavy_metals,

            "t_screening_min": t_screening,
            "t_neutralization_min": t_neutralization,
            "t_precipitation_min": t_precipitation,
            "t_heavy_metal_removal_min": t_heavy_metal_removal,
            "t_filter_press_min": t_filter_press,
            "t_carbon_filter_min": t_carbon_filter,
            "t_ro_min": t_ro,

            "equip_screening": equip_screening,
            "equip_neutralization": equip_neutralization,
            "equip_precipitation": equip_precipitation,
            "equip_heavy_metal_removal": equip_hm,
            "equip_filter_press": equip_filter_press,
            "equip_carbon_filter": equip_carbon_filter,
            "equip_ro": equip_ro,

            "capex_inr": capex_inr,
            "opex_per_day_inr": opex_per_day_inr,
            "cost_per_m3_inr": cost_per_m3_inr,
        }
        rows.append(row)

    return pd.DataFrame(rows)


# ---------------------------- TYPE 5 – HIGH ORGANIC LOAD ----------------------------

def generate_type5(n_samples: int = 800, random_state: int = 5) -> pd.DataFrame:
    """
    Type 5 – High Organic Load Wastewater
    Sequence:
      Screening → Anaerobic Reactor → Biogas Handling
      → Aeration Tank → Secondary Clarifier
      → Sludge Handling → Tertiary Filtration
    """
    rng = np.random.default_rng(random_state)
    rows = []

    for _ in range(n_samples):
        w_type = 5

        pH = rng.uniform(6.0, 8.0)
        TDS = rng.uniform(500, 4000)
        turbidity = rng.uniform(50, 600)
        BOD = rng.uniform(500, 2500)
        COD = rng.uniform(800, 5000)
        total_n = rng.uniform(30, 200)
        temperature = rng.uniform(20, 40)
        flow_m3_day = rng.uniform(100, 6000)
        total_volume_L_day = flow_m3_day * 1000
        heavy_metals = int(rng.random() < 0.2)

        organic_index = np.clip(BOD / 1000.0, 0.5, 3.0)
        sludge_index = np.clip((COD / 2000.0), 0.5, 3.0)

        # Stage times
        t_screening = float(rng.uniform(1.0, 3.0))

        base_anaerobic = rng.uniform(480.0, 1440.0)  # 8–24 h
        t_anaerobic = base_anaerobic * (0.8 + 0.4 * organic_index)

        base_biogas = rng.uniform(5.0, 30.0)
        t_biogas = base_biogas * (0.8 + 0.4 * organic_index)

        base_aeration = rng.uniform(120.0, 480.0)
        t_aeration = base_aeration * (0.8 + 0.4 * organic_index)

        base_secondary = rng.uniform(90.0, 240.0)
        t_secondary = base_secondary * (0.8 + 0.4 * organic_index)

        base_sludge = rng.uniform(60.0, 240.0)
        t_sludge = base_sludge * (0.8 + 0.4 * sludge_index)

        base_tertiary = rng.uniform(10.0, 30.0)
        t_tertiary = base_tertiary * (0.8 + 0.3 * organic_index)

        # Clamp
        t_screening = float(np.clip(t_screening, 0.5, 5.0))
        t_anaerobic = float(np.clip(t_anaerobic, 240.0, 2880.0))
        t_biogas = float(np.clip(t_biogas, 5.0, 60.0))
        t_aeration = float(np.clip(t_aeration, 60.0, 960.0))
        t_secondary = float(np.clip(t_secondary, 60.0, 360.0))
        t_sludge = float(np.clip(t_sludge, 30.0, 360.0))
        t_tertiary = float(np.clip(t_tertiary, 10.0, 60.0))

        # Equipment
        equip_screening = "coarse_screen" if flow_m3_day < 1000 else "mechanical_screen"

        if flow_m3_day < 1000:
            equip_anaerobic = "anaerobic_filter"
        else:
            equip_anaerobic = "uasb_reactor"

        equip_biogas = "biogas_holder_and_flare"

        equip_aeration = "diffused_aeration_tank"

        equip_secondary = "secondary_clarifier_circular"

        equip_sludge = "sludge_thickener_plus_press" if sludge_index > 1.0 else "sludge_drying_beds"

        equip_tertiary = "pressure_sand_filter_plus_acf"

        # Cost – anaerobic + sludge handling + aeration
        base_capex = 1.2e6
        time_sum_hours = (t_anaerobic + t_aeration + t_sludge) / 60.0

        capex_inr = (
            base_capex
            + 2500.0 * flow_m3_day
            + 3e4 * organic_index * time_sum_hours
            + 1e5 * heavy_metals
        )

        base_opex = 2e4
        aeration_cost = 15.0 * flow_m3_day * organic_index
        sludge_cost = 4000.0 * sludge_index
        chem_cost = 4.0 * flow_m3_day

        # Biogas gives some credit (negative cost)
        biogas_credit = -5.0 * flow_m3_day * organic_index

        opex_per_day_inr = base_opex + aeration_cost + sludge_cost + chem_cost + biogas_credit
        cost_per_m3_inr = opex_per_day_inr / flow_m3_day

        row = {
            "type": w_type,
            "pH": pH,
            "TDS_mgL": TDS,
            "turbidity_NTU": turbidity,
            "BOD_mgL": BOD,
            "COD_mgL": COD,
            "total_nitrogen_mgL": total_n,
            "temperature_C": temperature,
            "flow_m3_day": flow_m3_day,
            "total_volume_L_day": total_volume_L_day,
            "heavy_metals": heavy_metals,

            "t_screening_min": t_screening,
            "t_anaerobic_reactor_min": t_anaerobic,
            "t_biogas_handling_min": t_biogas,
            "t_aeration_min": t_aeration,
            "t_secondary_clarifier_min": t_secondary,
            "t_sludge_handling_min": t_sludge,
            "t_tertiary_filtration_min": t_tertiary,

            "equip_screening": equip_screening,
            "equip_anaerobic_reactor": equip_anaerobic,
            "equip_biogas_handling": equip_biogas,
            "equip_aeration": equip_aeration,
            "equip_secondary_clarifier": equip_secondary,
            "equip_sludge_handling": equip_sludge,
            "equip_tertiary_filtration": equip_tertiary,

            "capex_inr": capex_inr,
            "opex_per_day_inr": opex_per_day_inr,
            "cost_per_m3_inr": cost_per_m3_inr,
        }
        rows.append(row)

    return pd.DataFrame(rows)


# ---------------------------- MAIN: GENERATE & SAVE ----------------------------

if __name__ == "__main__":
    df1 = generate_type1()
    df2 = generate_type2()
    df3 = generate_type3()
    df4 = generate_type4()
    df5 = generate_type5()

    df1.to_csv("type1_potable_synthetic.csv", index=False)
    df2.to_csv("type2_domestic_synthetic.csv", index=False)
    df3.to_csv("type3_recycle_mbr_synthetic.csv", index=False)
    df4.to_csv("type4_industrial_synthetic.csv", index=False)
    df5.to_csv("type5_high_organic_synthetic.csv", index=False)

    # Combined dataset (union of all columns)
    df_all = pd.concat([df1, df2, df3, df4, df5], ignore_index=True)
    df_all.to_csv("synthetic_designs_all_types.csv", index=False)

    print("Type 1 shape:", df1.shape)
    print("Type 2 shape:", df2.shape)
    print("Type 3 shape:", df3.shape)
    print("Type 4 shape:", df4.shape)
    print("Type 5 shape:", df5.shape)
    print("ALL  shape:", df_all.shape)
    print("\nSaved 6 CSV files:")
    print("  - type1_potable_synthetic.csv")
    print("  - type2_domestic_synthetic.csv")
    print("  - type3_recycle_mbr_synthetic.csv")
    print("  - type4_industrial_synthetic.csv")
    print("  - type5_high_organic_synthetic.csv")
    print("  - synthetic_designs_all_types.csv")
