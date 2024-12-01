import {organizations} from "../config/mongoCollections.js";
import validation from '../helpers/validation.js';
import knownTagsFunctions from './knownTags.js';

const organizationFunctions ={
    async getOrganizationPageData(o_id){
        //Given o_id, return data required for organization page elements
        console.log("Implement Me")
    },

    async getOrganizationsInterest(o_idList){
        //Given list of o_ids, return list of projections containing o_id, name, interestedAccounts
        console.log("Implement Me")
    },
    
    async getOrganizationsTags(o_idList) {
        //Given list of o_ids, return list of projections containing, o_id, name, tags
        console.log("Implement Me")
    },

    async getOrganizationsWithTags(tags){
        //Given list of tags, return a list of organization ids that contain ANY of the tags
        console.log("Implement Me")
    },

    async getOrganizationsWithAllTags(tags){
        //Given list of tags, return a list of organization ids that contain ALL of the tags
        console.log("Implement Me")
    },

    async createOrganziation(newOrganization){
        //Create organization function with required information and optional information
        console.log("Mostly Implemented, check branch")
    },
    async updateOrganization(o_id){
        //update Organization, i am assuming you need the o_id 
        console.log("Implement Me")
    },

    async deleteOrganization(o_id){
        //delete Organization given o_id
        console.log("Implement Me")
    }
}
export default organizationFunctions;
