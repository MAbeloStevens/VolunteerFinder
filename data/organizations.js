
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

    /*
        These are mostly assumptions from the Page Blue print files.
        o_id: Object ID required
        org_name: string (optional)
        tags: array (optional)
        bannerImg: image file type (seems optional)
        description: string (optionak)
        contact: string (optional)
        link: string (url) (optional)
    */
    async updateOrganization(o_id, org_name, tags, bannerImg, description, contact, link){
        //update Organization,
        console.log("Implement Me")
    },

    async deleteOrganization(o_id){
        //delete Organization given o_id
        console.log("Implement Me")
    }
}
export default organizationFunctions;
