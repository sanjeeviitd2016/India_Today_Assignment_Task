class apiFeature {

    constructor(query,querystr){
        this.query= query;
        this.querystr= querystr   //keyword
    }

    search(){
        const keyword= this.querystr.keyword ? 
        {
            heading : {
                $regex : this.querystr.keyword,
                $options : "i"
            }
        }
        : {}

        this.query= this.query.find(keyword)
        return 1;

    }
}

module.exports= apiFeature