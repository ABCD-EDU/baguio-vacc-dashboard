import json
import csv


data = []
brgy_data = {}
vaccine_type_list = ["Astrazeneca", "Sputnik", "Pfizer",
                     "Moderna","Johnson & Johnson's Janssen","Gamaleya","Novavax","Sinovac"]
age_group_list = ["80+","75-79","70-74","65-69","60-64","55-59","50-54",
                  "45-49","40-44","35-39","30-34","25-29","20-24",
                  "15-19","10-14","5-9","0-4"]

category_list = ["A1","A2","A3","A4","A5","B&C"]


curr_id_number = 1
brgy_data["id"] = curr_id_number
import os
print('curr working directory')
print(os.getcwd())
with open('./res/data/data.csv', 'r') as file:

    lines = csv.reader(file, delimiter= ',', quotechar='"')
    for index, line in enumerate(lines):
        if index < 2:
            continue

        values = line
        brgy_data["id"] = curr_id_number
        brgy_data["name"] = values[0]
        brgy_data["population"] = values[1]
        brgy_data["vaccinated"] = values[2]
        vaccine_type_data = {}
        for index_inner, vaccine_type in enumerate(vaccine_type_list):
            vaccine_type_data[vaccine_type] = values[index_inner+4]
        brgy_data["vaccineType"] = vaccine_type_data

        age_group_data = {}
        for index_inner, age_group in enumerate(age_group_list):
            age_group_data[age_group] = values[index_inner+13]
        brgy_data["ageGroup"] = age_group_data

        category_data = {}
        for index_inner, category in enumerate(category_list):
            category_data[category] = values[index_inner+32]
        brgy_data["category"] = category_data

        per_sex_data = {}
        per_sex_data["M"] = values[index_inner+34]
        per_sex_data["F"] = values[index_inner+35]
        brgy_data["perSex"] = per_sex_data

        data.append(brgy_data.copy())
        curr_id_number+=1
        
with open('./res/data/output.json','w') as outfile:
    json.dump(data, outfile,indent=4)